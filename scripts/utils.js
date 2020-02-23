const { execSync } = require('child_process');
const { resolve } = require('path');

const run = cmd => {
  execSync(cmd, {
    encoding: 'utf8',
    cwd: resolve(__dirname, '..'),
    stdio: 'inherit',
  });
};

module.exports = {
  run,
};
