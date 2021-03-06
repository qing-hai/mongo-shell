module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The following operations remove the readPrices role from the products database\nuse products\ndb.dropRole( \"readPrices\", { w: \"majority\" } )"
    },
    {
      "type": "param",
      "string": "{string} rolename The name of the :ref:`user-defined role <user-defined-roles>` to remove from the database.",
      "name": "rolename",
      "description": "The name of the :ref:`user-defined role <user-defined-roles>` to remove from the database.",
      "types": [
        "string"
      ],
      "typesDescription": "<code>string</code>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [options] Additional options to pad to the command executor.",
      "name": "[options]",
      "description": "Additional options to pad to the command executor.",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "param",
      "string": "{object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
      "name": "[options.writeConcern]",
      "description": "The level of :doc:`write concern </reference/write-concern>` for the removal operation. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
      "types": [
        "object"
      ],
      "typesDescription": "<code>object</code>",
      "optional": true,
      "nullable": false,
      "nonNullable": false,
      "variable": false
    },
    {
      "type": "return",
      "string": "{Promise}",
      "types": [
        "Promise"
      ],
      "typesDescription": "<a href=\"Promise.html\">Promise</a>",
      "optional": false,
      "nullable": false,
      "nonNullable": false,
      "variable": false,
      "description": ""
    }
  ],
  "description": {
    "full": "Deletes a user-defined <user-defined-roles> role from the database on which you run the method.",
    "summary": "Deletes a user-defined <user-defined-roles> role from the database on which you run the method.",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 551,
  "codeStart": 562,
  "code": "dropRole(rolename, writeConcern) {\n  let cmd = { dropRole: rolename };\n  cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;\n\n  return this.runCommand(cmd)\n    .catch(res => {\n      if (res.code === 31) return false;\n      throw getErrorWithCode(res, res.errmsg);\n    })\n    .then(() => true);\n}",
  "ctx": {
    "type": "method",
    "name": "dropRole",
    "string": "dropRole()"
  }
}