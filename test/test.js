#!/usr/bin/env node
const fs = require('fs');
const doc = require('../lib/jsdoc.js');
const schema = require('../lib/schema.js');

let s = JSON.parse(fs.readFileSync('./package.json').toString());
console.log(schema.toJsDoc('PackageJson', s));
console.log(schema.toSchema('PackageJson', s));

