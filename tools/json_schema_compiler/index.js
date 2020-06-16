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
  let typingsOutput = '';

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
          if (param.type === 'function') processFunctions(param);

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
    }

    Object.values(fn).forEach((value) => {
      if (value instanceof Array) {
        value.forEach((x) => processFunctions(x));
      } else if (typeof value === 'object') {
        processFunctions(value);
      }
    });
  };

  for (const api of apisValues) {
    processRefs(api, api.namespace);
    processFunctions(api);
  }

  typingsOutput += 'interface Window { browser: typeof browser }\n\n';

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

    typingsOutput += `declare namespace browser.${api.namespace} {\n`;

    const getRef = (obj) => {
      if (typeof obj.ref === 'number') {
        return types[api.namespace][obj.ref].id;
      } else if (typeof obj.ref === 'object') {
        return `browser.${obj.ref.n}.${types[obj.ref.n][obj.ref.i].id}`;
      }

      return null;
    };

    const getJsType = (type) => {
      let ret = type;

      if (type === 'integer' || type === 'double' || type === 'long')
        ret = 'number';

      return ret;
    };

    const getType = (obj, level = 1, inside) => {
      const ref = getRef(obj);
      if (ref) return ref;

      if (obj.choices) {
        const a = obj.choices.map((x) => getType(x, level));
        if (inside === 'array') {
          for (let i = 0; i < a.length - 1; i++) {
            a[i] += '[]';
          }
        }
        return a.join(' | ');
      }

      if (obj.type === 'array')
        return getType(obj.items, level, 'array') + '[]';
      if (obj.type === 'object') {
        if (
          (obj.additionalProperties && (obj.properties || obj.functions)) ||
          !obj.additionalProperties
        ) {
          return `{\n${processTsObject(obj, level + 1)}${'  '.repeat(level)}}`;
        } else {
          return getJsType(obj.additionalProperties.type);
        }
      }

      if (obj.type === 'function') {
        let cb;
        return `(${(obj.parameters || [])
          .map((x) => {
            const p = parameters[x];

            if (p.name === 'callback') {
              cb = p;
            }

            return `${p.name}${
              p.name === 'callback' || p.optional ? '?' : ''
            }: ${getType(p, level, 'object')}`;
          })
          .join(', ')})${inside === 'object' ? ' =>' : ':'} ${
          obj.returns
            ? getType(obj.returns, level, 'object')
            : cb && cb.parameters && cb.parameters.length > 0
            ? `Promise<${getType(
                parameters[cb.parameters[Object.keys(cb.parameters)[0]]],
                level,
                'object',
              )}>`
            : 'void'
        }`;
      }

      return getJsType(obj.type);
    };

    const processDictionaryItem = (name, value, level = 1) => {
      return `${'  '.repeat(level)}${name}${
        value.optional ? '?' : ''
      }: ${getType(value, level, 'object')};\n`;
    };

    const processTsObject = (obj, level = 1) => {
      let out = '';

      if (obj.properties)
        out += Object.entries(obj.properties)
          .map(([key, value]) => processDictionaryItem(key, value, level))
          .join('');
      if (obj.functions)
        out += obj.functions
          .map((x) => processDictionaryItem(x.name, x, level))
          .join('');

      return out;
    };

    if (api.types) {
      for (const type of types[api.namespace]) {
        if (type.type === 'string') {
          output += `${type.id}:{`;
          for (const item of type.enum) {
            output += `${replaceAll(item.toUpperCase(), '-', '_')}:'${item}',`;
          }
          output += '},';
        } else if (type.type === 'array') {
          typingsOutput += `  export type ${type.id} = ${getType(type)};\n`;
        } else if (type.type === 'object') {
          if (type.id === 'Event') {
            typingsOutput += `  export interface Event<T extends Function> {
    addListener(callback: T): void;
    getRules(callback: (rules: Rule[]) => void): void;
    getRules(ruleIdentifiers: string[], callback: (rules: Rule[]) => void): void;
    hasListener(callback: T): boolean;
    removeRules(ruleIdentifiers?: string[], callback?: () => void): void;
    removeRules(callback?: () => void): void;
    addRules(rules: Rule[], callback?: (rules: Rule[]) => void): void;
    removeListener(callback: T): void;
    hasListeners(): boolean;
  }\n`;
            continue;
          }

          if (type.isInstanceOf) {
            typingsOutput += `  export type ${type.id} = ${type.isInstanceOf};\n`;
          } else {
            typingsOutput += `  export interface ${type.id} ${getType(type)}\n`;
          }
        }
      }
    }
    if (api.functions) {
      for (const fn of api.functions) {
        output += `${fn.name}:i('${api.namespace}', '${
          fn.name
        }', ${JSON.stringify(fn.parameters)}),`;

        typingsOutput += `  export function ${fn.name}${getType(fn)};\n`;
      }
    }
    if (api.events) {
      for (const event of api.events) {
        output += `${event.name}:e('${api.namespace}', '${event.name}'),`;

        typingsOutput += `  export const ${
          event.name
        }: chrome.events.Event<${getType(event, 1, 'object')}>;\n`;
      }
    }

    output += '},';

    typingsOutput += '}\n\n';
  }

  output += '};';

  output += `var f=${stripJsonComments(
    readFileSync(apiFeaturesPath, 'utf8'),
  )};`;

  output += readFileSync(join(__dirname, './api_features.js'), 'utf8');

  output += '};';

  output += 'module.exports = getAPI;';

  return { js: output, ts: typingsOutput };
};
