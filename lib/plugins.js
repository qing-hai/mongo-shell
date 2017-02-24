const npmi = require('npmi');
const path = require('path');
const os = require('os');
const fs = require('fs');
const mkdirp = require('mkdirp');
const columnify = require('columnify');
const { palette } = require('./colors');

class Plugins {
  static async cmd(code, state, log) {
    // Split the code into pieces
    const parts = code.split(' ');

    if (parts.length === 1) {
      return "available commands are list, install, remove";
    } else if (parts.length >= 2) {
      switch(parts[1]) {
        case 'install': {
          return await install(parts, state);
        }

        case 'list': {
          return await list(parts, state);
        }

        case 'remove': {
          return await remove(parts, state);
        }

        default: {
          return `command ${parts[1]} is not supported`;
        }
      }
    }
  }

  static async help(code, log) {
    // Split up the command
    const parts = code.split(' ');
    // Remove the first part
    parts.shift();
    // Return contextual help
    if (parts.length === 1) {
      return log(columnify(
        [
          [palette.string.green('help plugin'), 'Plugin level help'],
          [palette.string.green('help plugin install'), 'Plugin install level help'],
          [palette.string.green('help plugin list'), 'Plugin list level help'],
          [palette.string.green('help plugin remove'), 'Plugin remove level help'],
        ], { showHeaders: false }));
    } else if (parts.length === 2 && parts[1] === 'install') {
      return log(`${palette.string.green('help plugin install <name[@version]>')}\nInstall a plugin from NPM using the package name convention from NPM, ex: mongodb@2.2.24`);
    } else if (parts.length == 2 && parts[1] === 'list') {
      return log(`${palette.string.green('help plugin list')}\nList the currently install plugins.`);
    } else if (parts.length == 2 && parts[1] === 'remove') {
      return log(`${palette.string.green('help plugin remove <name>')}\nRemove a plugin using the package name convention from NPM, ex: mongodb@2.2.24`);
    }

    return log(`plugin command not supported`);
  }
}

async function install(parts, state) {
  // Let get the users home directory
  const _path = `${os.homedir()}/.mongo`;
  // Attempt to create the directory
  mkdirp.sync(_path);

  // Build the parts
  var options = {
      // your module name
      name: parts[2],
      // expected version [default: 'latest']
      version: parts[3] || 'latest',
      // installation path [default: '.']
      path: _path,
      // force install if set to true (even if already installed, it will do a reinstall) [default: false]
      forceInstall: true,
      // npm.load(options, callback): this is the "options" given to npm.load()
      npmLoad: {
        // [default: {loglevel: 'silent'}]
        loglevel: 'silent',
        progress: false,
        production:true,
        json: false,
      }
  };

  // Execute npm install
  const result = await executeNpmi(options);
  // Module install path
  const _module = result.pop();
  const moduleInstallPath = _module[1];
  // Let's read the package.json to establish if this is a supported plugin or not
  const packageJson = JSON.parse(fs.readFileSync(`${moduleInstallPath}/package.json`, 'utf8'));

  // Ensure this is an actual plugin
  if (packageJson.mongo && packageJson.mongo.plugin
    && packageJson.mongo.plugin.type == 'shell') {
      try {
        // Attemp to write the plugin
        await updatePluginLists(state, _path, _module);
      } catch(err) {
        console.log(err)
      }

      // Return the installed successfully
      return `plugin ${options.name}@${options.version} installed successfully in ${path.resolve(options.path)}`;
    }

  // Return it's not a valid plugin
  return `plugin ${options.name}@${options.version} is not a valid plugin`;
}

async function updatePluginLists(state, path, _module) {
  let configuration = null;

  try {
    configuration = await state.configuration.read();
  } catch (err) {
    configuration = {
      plugins: []
    };
  }

  // Ensure we don't have multiple entries
  const plugins = [];

  // Ensure we don't have duplicate records
  for (let m of configuration.plugins) {
    if (m[0].split('@')[0] !== _module[0].split('@')[0]) {
      plugins.push(m);
    }
  }

  // Push the module we added
  plugins.push(_module);
  // Set the plugin
  configuration.plugins = plugins;
  // Write the configuration file
  await state.configuration.write(configuration);
}

function executeNpmi(options) {
  return new Promise((resolve, reject) => {
    npmi(options, function (err, result) {
      if (err) {
        if (err.code === npmi.LOAD_ERR) {
          return reject('npm load error');
        } else if (err.code === npmi.INSTALL_ERR) {
          return reject('npm install error');
        }

        return reject(err.message);
      }

      resolve(result);
    });
  });
}

async function list(parts, state) {
  const plugins = await readPlugins(state);
  // For each plugin generate a description entry
  let descriptions = [];

  for (const entry of plugins) {
    try {
      const packageJSON = require(`${entry[1]}/package.json`);
      descriptions.push([palette.string.green(packageJSON.name), palette.string.yellow(packageJSON.version), packageJSON.description]);
    } catch (err) {
      // Might print plugin not found
    }
  }

  // Render the list
  return columnify(descriptions, { showHeaders: false, config: { 0: { minWidth: 10 }, 1: {minWidth: 10, maxWidth: 10}, 2: {maxWidth: 80} } })
}

async function remove(parts, state) {
  // Read the configuration file
  const plugins = await readPlugins(state);

  if (parts.length < 3) {
    return `plugin remove requies a NPM style module definition. ex: plugin remove mongodb`;
  }

  // Get the plugin
  const plugin = parts[2].split('@')[0].trim();
  const postPlugins = [];

  // If we specified a version remove that particular version
  for (const entry of plugins) {
    console.log(`compare ${entry[0].split('@')[0].trim()} to ${plugin} == ${entry[0].split('@')[0].trim() !== plugin}`)
    if (entry[0].split('@')[0].trim() !== plugin) {
      postPlugins.push(entry);
    }
  }

  // Now attempt to read the actual list of plugins
  try {
    // Read the configuration file
    const configuration = await state.configuration.read();
    // Change the list of plugins
    configuration.plugins = postPlugins;
    // Write the file back to disk
    await state.configuration.write(configuration);
  } catch(err) {
    return `failed to read or write ${_path}/plugins.json, it might have been removed or have wrong permissions`;
  }
}

async function readPlugins(state) {
  // Contains list of plugins
  let plugins = [];

  // Now attempt to read the actual list of plugins
  try {
    // Read the configuration file
    const configuration = await state.configuration.read();
    // Ge the plugins
    plugins = configuration.plugins || [];
  } catch(err) {
    // Just ignore error
  }

  return plugins;
}

module.exports = Plugins;