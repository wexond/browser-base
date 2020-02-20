const { spawn } = require('child_process');
const { platform } = require('os');
const package = require('../package.json');
const electronBuilder = require('../electron-builder.json');
const { promises } = require('fs');
const { resolve } = require('path');

const os = platform();

const npm = os === 'win32' ? 'npm.cmd' : 'npm';

const runScript = script =>
  new Promise(resolve => {
    const child = spawn(npm, ['run', script], {
      cwd: __dirname,
      stdio: 'inherit',
    });

    child.on('close', () => {
      resolve();
    });
  });

(async () => {
  try {
    await promises.unlink(resolve(__dirname, '../temp-package.json'));
  } catch (e) {}

  try {
    if (package.version.indexOf('nightly') !== -1) {
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

    if (os === 'win32') await runScript('compile-win32');
    else if (os === 'darwin') await runScript('compile-darwin');
    else if (os === 'linux') await runScript('compile-linux');
  } catch (e) {
    console.error(e);
  }

  await promises.unlink(resolve(__dirname, '../package.json'));
  await promises.unlink(resolve(__dirname, '../electron-builder.json'));

  await promises.rename(
    resolve(__dirname, '../temp-package.json'),
    resolve(__dirname, '../package.json'),
  );
  await promises.rename(
    resolve(__dirname, '../temp-electron-builder.json'),
    resolve(__dirname, '../electron-builder.json'),
  );
})();
