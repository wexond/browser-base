const package = require('../package.json');
const electronBuilder = require('../electron-builder.json');
const { promises } = require('fs');
const { resolve } = require('path');
const { run } = require('./utils');

const isNightly = package.version.indexOf('nightly') !== -1;

const getPlatform = () => {
  if (process.platform === 'win32') return 'windows';
  else if (process.platform === 'darwin') return 'mac';
  return process.platform;
};

const getEnv = (name) => process.env[name.toUpperCase()] || null;

const setEnv = (name, value) => {
  if (value) {
    process.env[name.toUpperCase()] = value.toString();
  }
};

const getInput = (name) => {
  return getEnv(`INPUT_${name}`);
};

(async () => {
  try {
    if (isNightly) {
      await promises.copyFile(
        resolve(__dirname, '../package.json'),
        resolve(__dirname, '../temp-package.json'),
      );
      await promises.copyFile(
        resolve(__dirname, '../electron-builder.json'),
        resolve(__dirname, '../temp-electron-builder.json'),
      );
      const newPkg = {
        ...package,
        name: 'wexond-nightly',
        repository: {
          type: 'git',
          url: 'git+https://github.com/wexond/desktop-nightly.git',
        },
      };
      await promises.writeFile(
        resolve(__dirname, '../package.json'),
        JSON.stringify(newPkg),
      );

      const newEBConfig = {
        ...electronBuilder,
        appId: 'org.wexond.wexond-nightly',
        productName: 'Wexond Nightly',
        directories: {
          output: 'dist',
          buildResources: 'static/nightly-icons',
        },
      };

      await promises.writeFile(
        resolve(__dirname, '../electron-builder.json'),
        JSON.stringify(newEBConfig),
      );
    }

    const release =
      (getEnv('release') === 'true' || getEnv('release') === true) &&
      getEnv('GH_TOKEN');
    const platform = getPlatform();

    if (platform === 'mac') {
      setEnv('CSC_LINK', getEnv('mac_certs'));
      setEnv('CSC_KEY_PASSWORD', getEnv('mac_certs_password'));
    } else if (platform === 'windows') {
      setEnv('CSC_LINK', getEnv('windows_certs'));
      setEnv('CSC_KEY_PASSWORD', getEnv('windows_certs_password'));
    }

    run('yarn run build');
    run(
      `npx --no-install electron-builder --${platform} ${
        release ? '-p always' : ''
      }`,
    );
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
