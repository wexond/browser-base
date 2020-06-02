const { readFileSync } = require('fs');
const stripJsonComments = require('strip-json-comments');
const equal = require('deep-equal');
const { join } = require('path');

function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

module.exports = (jsonObjects, apiFeaturesPath) => {
  const apis = {};

  for (const obj of jsonObjects) {
    apis[obj[0].namespace] = obj[0];
  }

  const chrome = {};

  const types = {};

  const parameters = [];

  let output = '';

  const apisValues = Object.values(apis);

  const removeInfo = (obj) => {
    Object.values(obj).forEach((value) => {
      if (value instanceof Array) {
        value.forEach((x) => removeInfo(x));
      } else if (typeof value === 'object') {
        removeInfo(value);
      }
    });

    delete obj.description;
    delete obj.deprecated;
  };

  removeInfo(apis);

  for (const api of apisValues) {
    types[api.namespace] = [];
    api.types.forEach((type) => {
      if (type.type === 'string') {
        const newEnum = [];

        for (const item of type.enum) {
          if (typeof item === 'object') {
            newEnum.push(item.name);
          } else {
            newEnum.push(item);
          }
        }

        type.enum = newEnum;

        types[api.namespace].push(type);
      }

      types[api.namespace].push(type);
    });
  }

  const processRefs = (type, namespace) => {
    const ref = type['$ref'];

    if (ref) {
      let objectName = ref;
      let nsp = namespace;

      if (ref.indexOf('.') !== -1) {
        const [ns, obj] = ref.split('.');
        nsp = ns;
        objectName = obj;
      }

      const index = types[nsp].findIndex((x) => x.id === objectName);

      if (nsp === namespace) {
        type.ref = index;
      } else {
        type.ref = { n: nsp, i: index };
      }

      delete type['$ref'];
    }

    Object.values(type).forEach((value) => {
      if (value instanceof Array) {
        value.forEach((x) => processRefs(x, namespace));
      } else if (typeof value === 'object') {
        processRefs(value, namespace);
      }
    });
  };

  Object.entries(types).forEach(([namespace, types]) => {
    for (const type of types) {
      processRefs(type, namespace);
    }
  });

  const processFunctions = (fn) => {
    if (fn.type === 'function') {
      if (typeof fn.parameters === 'object') {
        const params = [];
        for (const param of fn.parameters) {
          delete param.parameters;

          let index = parameters.findIndex((x) => {
            return equal(x, param);
          });

          if (index === -1) {
            parameters.push(param);
            index = parameters.length - 1;
          }

          params.push(index);
        }

        fn.parameters = params;
      }
    } else {
      Object.values(fn).forEach((value) => {
        if (value instanceof Array) {
          value.forEach((x) => processFunctions(x));
        } else if (typeof value === 'object') {
          processFunctions(value);
        }
      });
    }
  };

  for (const api of apisValues) {
    processRefs(api, api.namespace);
    processFunctions(api);
  }

  output += `const getAPI = (context, processParameters) => {`;

  output += readFileSync(join(__dirname, './validator.js'), 'utf8');

  output += `var p=${JSON.stringify(parameters).replace(
    /"([^"]+)":/g,
    '$1:',
  )};`;
  output += `var t=${JSON.stringify(types).replace(/"([^"]+)":/g, '$1:')};`;

  output += `var api={`;

  for (const api of apisValues) {
    chrome[api.namespace] = {};
    output += `${api.namespace}:{`;

    if (api.types) {
      for (const type of types[api.namespace]) {
        if (type.type === 'string') {
          output += `${type.id}:{`;
          for (const item of type.enum) {
            output += `${replaceAll(item.toUpperCase(), '-', '_')}:'${item}',`;
          }
          output += '},';
        }
      }
    }
    if (api.functions) {
      for (const fn of api.functions) {
        output += `${fn.name}:i('${api.namespace}', '${
          fn.name
        }', ${JSON.stringify(fn.parameters)}),`;
      }
    }
    if (api.events) {
      for (const event of api.events) {
        output += `${event.name}:e('${api.namespace}', '${event.name}'),`;
      }
    }

    output += '},';
  }

  output += '};';

  output += `var f=${stripJsonComments(
    readFileSync(apiFeaturesPath, 'utf8'),
  )};`;

  output += readFileSync(join(__dirname, './api_features.js'), 'utf8');

  output += '};';

  output += 'module.exports = getAPI;';

  return output;
};
