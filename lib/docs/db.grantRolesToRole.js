module.exports = {
  "tags": [
    {
      "type": "example",
      "string": "// The following grantRolesToRole() operation updates the productsReaderWriter role in the products database to inherit the privileges of productsReader rol\nuse products\ndb.grantRolesToRole(\n  \"productsReaderWriter\",\n  [ \"productsReader\" ],\n  { w: \"majority\" , wtimeout: 5000 })"
    },
    {
      "type": "param",
      "string": "{string} rolename The name of the role to which to grant sub roles.",
      "name": "rolename",
      "description": "The name of the role to which to grant sub roles.",
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
      "string": "{array} roles An array of roles from which to inherit.",
      "name": "roles",
      "description": "An array of roles from which to inherit.",
      "types": [
        "array"
      ],
      "typesDescription": "<code>array</code>",
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
      "string": "{object} [options.writeConcern] The level of :doc:`write concern </reference/write-concern>` for the modification. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
      "name": "[options.writeConcern]",
      "description": "The level of :doc:`write concern </reference/write-concern>` for the modification. The ``writeConcern`` document takes the same fields as the `getLastError` command.",
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
    "full": "Grants roles to a user-defined role <user-defined-roles> .",
    "summary": "Grants roles to a user-defined role <user-defined-roles> .",
    "body": ""
  },
  "isPrivate": false,
  "isConstructor": false,
  "isClass": false,
  "isEvent": false,
  "ignore": false,
  "line": 982,
  "codeStart": 997,
  "code": "grantRolesToRole(rolename, roles, writeConcern) {\n  let cmd = { grantRolesToRole: rolename, roles: roles };\n  cmd.writeConcern = writeConcern ? writeConcern : DEFAULT_WRITE_CONCERN;\n\n  return this.runCommand(cmd)\n    .catch(res => { throw getErrorWithCode(res, res.errmsg); });\n}",
  "ctx": {
    "type": "method",
    "name": "grantRolesToRole",
    "string": "grantRolesToRole()"
  }
}