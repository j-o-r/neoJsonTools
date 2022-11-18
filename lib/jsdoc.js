const json = require('json-pointer');

function generate (schema, options = {}) {
  let jsdoc = '';

  if (!schema || Object.keys(schema).length === 0) {
    if (!json.has(schema, '/type')) {
      return jsdoc;
    }
  }
  let type = json.get(schema, '/type');
  jsdoc += '/**\n';
  jsdoc += writeDescription(schema, type);
  let res = [];
  if (type !== 'array') {
    res = processProperties(schema, false, options);
    res.reverse();
    jsdoc += res.shift();
  }
  jsdoc += '  */\n';

  let i = 0, len = res.length;
  for (;i < len; i++) {
    jsdoc += res[i];
  }

  return jsdoc;
}

function processProperties (schema, nested, options = {}, p) {
  let result = [];
  const props = json.get(schema, '/properties');
  const required = json.has(schema, '/required') ? json.get(schema, '/required') : [];

  let text = '';
  for (let property in props) {
    if (Array.isArray(options.ignore) && options.ignore.includes(property)) {
      continue;
    } else {
      let prefix = nested ? '.' : '';
      if (prefix === '.' && p) {
        prefix = p + '.';
      }
      if (props[property].type === 'object' && props[property].properties) {
        text += writeParam('object', prefix + property, props[property].description, true);
        text += processProperties(props[property], true, options, property);
      } else {
        let optional = !required.includes(property);
        let type = getType(props[property]) || upperFirst(property);
        if (type === 'array') {
          let recursive = false;
          if (props[property].items && props[property].items.type) {
             let oName = props[property].items.type;
             if (oName === 'object') {
               recursive = true;
               oName = upperFirst(property) + upperFirst(props[property].items.type);
             }
             type = 'Array<' + oName + '>';
           }
           if (recursive) {
             props[property].items.title = property;
             result.push(generate(props[property].items));
           }
        }
        text += writeParam(type, prefix + property, props[property].description, optional);
      }
    }
  }
  result.push(text);
  return result;
}

function writeDescription (schema, suffix = 'object', title) {
  if (suffix === 'object') {
     let kind = '';
     if (title) {
      kind = title;
     } else {
      kind = schema.title;
    }
    let text = schema.description || `Represents a ${kind} ${suffix}`;
    text += `\n  * @typedef {object} ${upperFirst(kind)}${upperFirst(suffix)}`;
    // 1text += `\n  * @type ${suffix}`;
    return `  * ${text}\n  *\n`;
  } else if (suffix === 'array') {
    let mtype = schema.items.type;
    let text = '';
    if (mtype === 'object') {
      text = `\n`;
      text += writeDescription(schema.items, 'object', schema.items.title);
      text += processProperties(schema.items, false);
      text += `  * \n`;
      text += '  */\n';
      text += '/**\n';
      text += `  *\n  * `;
      mtype = `${upperFirst(schema.items.title)}${upperFirst(mtype)}`;
    }
    text += schema.description || `Represents a ${schema.items.title} ${suffix}`;
    text += `\n  * @typedef ${upperFirst(schema.items.title)}${upperFirst(suffix)}`;
    text += `\n  * @type ${upperFirst(suffix)}<${mtype}>`;
    return `  * ${text}\n  *\n`;
  }
}

function writeParam (type = '', field, description = '', optional) {
  if (type === 'array' || type === 'object') {
    type = upperFirst(type);
  }
  const fieldTemplate = optional ? `[${field}]` : field;
  return `  * @property {${type}} ${fieldTemplate} - ${description} \n`;
}

function getType (schema) {
  if (schema.$ref) {
    const ref = json.get(schema, schema.$ref.substr(2));
    return getType(ref);
  }

  if (schema.enum) {
    return 'enum';
  }

  if (Array.isArray(schema.type)) {
    if (schema.type.includes('null')) {
      return `?${schema.type[0]}`;
    } else {
      return schema.type.join('|');
    }
  }

  return schema.type;
}

function upperFirst (str = '') {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}
module.exports = generate;
