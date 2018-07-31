const { performance } = require('perf_hooks');

const eol = (i, str) => i === str.trim().length - 1;

const tokenize = str => {
  const tokens = [];

  let data = '';
  let mode = '';

  for (let i = 0; i < str.length; i++) {
    const c = str[i];

    if (mode !== '' && eol(i, str)) {
      data += c;
      tokens.push(data);
      break;
    }

    if (mode === 'id' || mode === 'tag' || c === 'selector' || mode === 'class') {
      if (
        c === ','
        || c === ' '
        || c === '['
        || c === '>'
        || c === '+'
        || c === '~'
        || c === '<'
        || (mode === 'class' && c === '#')
      ) {
        tokens.push(data);

        mode = '';
        data = '';
      }
    }

    if (mode === '') {
      data = '';
      if (c === '.') {
        mode = 'class';
      } else if (c === '#') {
        mode = 'id';
      } else if (c === '[') {
        mode = 'attribute';
      } else if (c === ':') {
        mode = 'selector';
      } else if (c !== '<' && c !== '>' && c !== '+' && c !== '~' && c !== ' ' && c !== ',') {
        mode = 'tag';
      }
    }

    if (mode !== '') {
      data += c;
    }

    if (mode === 'attribute') {
      if (c === ']') {
        tokens.push(data);

        mode = '';
        data = '';
      }
    }

    if (mode === '') {
      if (c === ' ') {
        const prev = tokens[tokens.length - 1];
        if (prev && prev.trim() !== '') {
          if (
            (prev.indexOf('.') !== -1
              || prev.indexOf('#') !== -1
              || (prev.indexOf('[') === -1
                && prev.indexOf('.') === -1
                && prev.indexOf(' ') === -1
                && prev.indexOf('#') === -1
                && prev.indexOf('>') === -1
                && prev.indexOf('~') === -1
                && prev.indexOf('+') === -1
                && prev.indexOf('<') === -1))
            && str[i - 1] !== ','
          ) {
            tokens.push(c);
            mode = '';
            data = '';
          }
        }
      } else if (c === '+' || c === '>' || c === '<' || c === '~') {
        const prev = tokens[tokens.length - 1];
        if (prev && prev.trim() === '') {
          tokens.splice(tokens.length - 1, 1);
        }
        tokens.push(c);
        mode = '';
        data = '';
      }
    }
  }

  return tokens;
};

const parse = (raw, tokens) => {
  const attributes = [];

  for (const token of tokens) {
    if (
      token === ' '
      || token.startsWith(':')
      || token === '>'
      || token === '<'
      || token === '~'
      || token === '+'
    ) {
      return { raw };
    }

    if (token.indexOf('.') !== -1) {
      attributes.push({
        raw: token,
        type: 'attribute',
        name: 'class',
        value: token.substr(1),
        action: 'equals',
      });
    } else if (token.indexOf('#') !== -1) {
      attributes.push({
        raw: token,
        type: 'attribute',
        name: 'id',
        value: token.substr(1),
        action: 'equals',
      });
    } else if (token.startsWith('[')) {
      const attribute = token
        .replace('[', '')
        .replace(']', '')
        .replace(/"/g, '');

      let name = token;
      let value = '';
      let operator;
      let action = 'exists';

      if (attribute.indexOf('=') !== -1) {
        if (attribute.indexOf('*=')) {
          operator = '*=';
          action = 'contains';
        } else if (attribute.indexOf('~=')) {
          operator = '~=';
          action = 'contains';
        } else if (attribute.indexOf('|=')) {
          operator = '|=';
          action = 'starts';
        } else if (attribute.indexOf('^=')) {
          operator = '^=';
          action = 'starts';
        } else if (attribute.indexOf('$=')) {
          operator = '$=';
          action = 'ends';
        }

        const parts = token.split(operator);
        name = parts[0];
        value = parts[1];
      } else {
        attributes.push({
          raw: token,
          type: 'tag',
          value: token,
        });
      }

      attributes.push({
        raw: token,
        type: 'attribute',
        name,
        value,
        action,
      });
    }
  }

  return {
    raw,
    attributes,
  };
};

const isAttributeMatch = (attributes, attr) => {
  for (const attribute of attributes) {
    if (attribute.name === attr.name) {
      if (
        attr.action === 'exists'
        || (attr.action === 'equals' && attr.value === attribute.value)
        || (attr.action === 'starts' && attribute.value.startsWith(attr.value))
        || (attr.action === 'ends' && attribute.value.endsWith(attr.value))
        || (attr.action === 'contains' && attribute.value.indexOf(attr.value) !== -1)
        || attr.name === 'class'
      ) {
        if (attr.name === 'class' && attr.action === 'equals') {
          const classes = attr.value.split('.');
          const classesStr = classes.join(' ');

          return attribute.value === classesStr;
        }
        return true;
      }
      return false;
    }
  }

  return false;
};

const matches = (node, attributes) => {
  for (const attribute of attributes) {
    if (attribute.type === 'tag') {
      if (attribute.value !== node.tagName) return false;
    } else if (attribute.type === 'attribute') {
      if (!isAttributeMatch(node.attributes, attribute)) return false;
    }
  }

  return true;
};

const selectors = [];

process.on('message', data => {
  const { virtualNodes, blockedSelectors } = data;

  if (blockedSelectors) {
    const t0 = performance.now();

    for (const selector of blockedSelectors) {
      selectors.push(parse(selector, tokenize(selector)));
    }

    process.send(`Parsing selectors time: ${performance.now() - t0}`);
  } else if (virtualNodes) {
    const verified = [];

    const t0 = performance.now();

    for (const selector of selectors) {
      for (const node of virtualNodes) {
        if (selector.attributes) {
          if (matches(node, selector.attributes) && verified.indexOf(selector.raw) === -1) {
            verified.push(selector.raw);
          }
        } else if (verified.indexOf(selector.raw) === -1) verified.push(selector.raw);
      }
    }

    process.send(`Overall time: ${performance.now() - t0}`);

    if (verified.length > 0) process.send(verified);
  }
});
