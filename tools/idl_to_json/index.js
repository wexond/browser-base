const { parse } = require('webidl2');
const { readFileSync, writeFileSync } = require('fs');

const idlToJsonMap = {
  callback: 'function',
  operation: 'function',
  interface: 'object',
  dictionary: 'object',
  DOMString: 'string',
  double: 'double',
  long: 'long',
  boolean: 'boolean',
};

const allTypes = [];

const parseIdlType = (idlType) => {
  const name = idlType;
  const type = idlToJsonMap[name];

  if (typeof name === 'string') {
    if (type) {
      return { type };
    } else {
      const foundType = allTypes.find((x) => x.id === name);

      if (!foundType) {
        console.log(name);
        console.log(JSON.stringify(idlType, null, 2));
        throw new Error(`Type ${name} not found.`);
      }

      if (foundType.private) {
        const item = { ...foundType };
        delete item.id;
        delete item.private;
        return item;
      } else {
        return { $ref: name };
      }
    }
  }

  if (Array.isArray(idlType.idlType))
    return { type: 'array', items: parseIdlType(idlType.idlType[0]) };

  const t = { ...idlType.idlType };

  if (t.required === false || t.optional === true) {
    t.optional = true;
  }

  return parseIdlType(idlType.idlType);
};

const parseMember = (member) => {
  const prop = {
    ...parseIdlType(member.idlType),
    name: member.name,
  };

  if (member.required === false || member.optional === true) {
    prop.optional = true;
  }

  return prop;
};

const parseFunction = (fn) => {
  const fnc = {
    name: fn.name,
    type: 'function',
    parameters: [],
  };

  for (const arg of fn.arguments) {
    const param = parseMember(arg);
    fnc.parameters.push(param);
  }

  return fnc;
};

module.exports = (idlPath) => {
  const content = readFileSync(idlPath, 'utf8');
  const ast = parse(content);

  const json = [
    {
      namespace: ast.find((x) => x.type === 'namespace').name,
      types: [],
      functions: [],
      events: [],
    },
  ];

  for (const item of ast) {
    const private = item.extAttrs.find((x) => x.name === 'private');

    if (item.type === 'dictionary') {
      const newItem = {
        id: item.name,
        type: 'object',
        properties: {},
      };

      for (const member of item.members) {
        newItem.properties[member.name] = parseMember(member);
      }

      allTypes.push({
        ...newItem,
        private,
      });

      if (!private) {
        json[0].types.push(newItem);
      }
    } else if (item.type === 'enum') {
      const newItem = {
        id: item.name,
        type: 'string',
        enum: item.values.map((x) => x.value),
      };

      allTypes.push({
        ...newItem,
        private,
      });

      if (!private) {
        json[0].types.push(newItem);
      }
    } else if (item.type === 'operation' || item.type === 'callback') {
      const fn = parseFunction(item);
      allTypes.push({ ...fn, id: fn.name, private: true });
    } else if (
      item.type === 'interface' &&
      (item.name === 'Functions' || item.name === 'Events')
    ) {
      const scope = item.name === 'Events' ? json[0].events : json[0].functions;

      for (const fn of item.members) {
        if (!private) {
          scope.push(parseFunction(fn));
        }
      }
    }
  }

  return json;
};
