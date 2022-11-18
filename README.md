# neoJsonTools

neovim plugin based on the neovim node-client.

* Create a JSON schema from JSON (example from :e jsconfig.json)
```
:Json2Schema
```
```
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Jsconfig",
  "type": "object",
  "properties": {
    "compilerOptions": {
      "type": "object",
      "properties": {
        "target": {
          "type": "string"
        },
        "module": {
          "type": "string"
        },
        "checkJs": {
          "type": "boolean"
        },
        "moduleResolution": {
          "type": "string"
        }
      }
    },
    "include": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}

```
* Format json
```
:JsonFormat
```
* json to JSDOC
```
:Json2JSDoc
```
```
/**
  * Represents a Jsconfig object
  * @typedef {object} JsconfigObject
  *
  * @property {object} [compilerOptions] -
  * @property {string} [compilerOptions.target] -
  * @property {string} [compilerOptions.module] -
  * @property {boolean} [compilerOptions.checkJs] -
  * @property {string} [compilerOptions.moduleResolution] -
  * @property {Array<string>} [include] -
  */

```

## deps:

nodejs
neovim > 0.4

neovim node-client

```
:checkhealth
```
If node-client is not installed type:
```
npm install -g neovim
```
https://neovim.io/doc/user/remote_plugin.html

Init new plugin and restart neovim

Place the plugin in the folder:

```
~/.config/nvim/rplugin/node
npm install
``
and run (within nvim)

```
:UpdateRemotePlugins
```

