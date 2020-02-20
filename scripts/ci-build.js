const package = require('../package.json');
const electronBuilder = require('../electron-builder.json');
const { promises } = require('fs');
const { resolve } = require('path');

const isNightly = package.version.indexOf('nightly') !== -1;

(async () => {
  try {
    await promises.unlink(resolve(__dirname, '../temp-package.json'));
  } catch (e) {}

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
  } catch (e) {
    console.error(e);
  }
})();
