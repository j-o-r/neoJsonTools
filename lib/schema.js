
var GenerateSchema = require('generate-schema');
var toJsDoc = require('./jsdoc.js');

module.exports = {
  toSchema: (name, o) => {
    return JSON.stringify(GenerateSchema.json(name, o), null, '  ');
  },
  toJsDoc: (name, o) => {
   let s = GenerateSchema.json(name, o);
   return toJsDoc(s);
  }
};
