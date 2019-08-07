const { existsSync, createWriteStream, unlinkSync } = require('fs');
const mkdirp = require('mkdirp');
const axios = require('axios');
const { promisify } = require('util');
const extractZip = require('extract-zip');
const { resolve } = require('path');

const extract = promisify(extractZip);

const darkreaderPath = resolve(
  __dirname,
  '../build/extensions/wexond-darkreader',
);

mkdirp(darkreaderPath, async err => {
  if (err) return console.error(err);

  if (!existsSync(resolve(darkreaderPath, 'manifest.json'))) {
    try {
      const asset = 'https://wexond.net/build.zip';

      console.log('Downloading build.zip...');
      const res2 = await axios({
        url: asset,
        method: 'GET',
        responseType: 'stream',
      });

      const zipPath = resolve(__dirname, '../build/extensions/build.zip');
      const stream = createWriteStream(zipPath);

      res2.data.pipe(stream);

      stream.on('close', async () => {
        await extract(zipPath, { dir: darkreaderPath });
        unlinkSync(zipPath);
      });
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }
});
