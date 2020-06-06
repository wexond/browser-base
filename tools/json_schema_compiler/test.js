const parse = require('./index');
const { writeFileSync, readFileSync, readdirSync } = require('fs');
const { join } = require('path');
const stripJsonComments = require('strip-json-comments');

const jsons = [];
const path = join(__dirname, '../../src/common/extensions/api');
readdirSync(path).forEach((file) => {
  if (file.startsWith('_')) return;
  if (!file.endsWith('.json')) return;

  const content = readFileSync(join(path, file), 'utf8');

  jsons.push(JSON.parse(stripJsonComments(content)));
});

const output = parse(jsons, join(path, '_api_features.json'));
writeFileSync(join(__dirname, 'a.d.ts'), output.ts);
