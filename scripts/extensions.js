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

try {
  mkdirp(darkreaderPath, async err => {
    if (err) return console.error(err);
  
    if (!existsSync(resolve(darkreaderPath, 'manifest.json'))) {
      console.log('Fetching wexond darkreader releases...');
      const res = await axios({
        url: 'https://api.github.com/repos/wexond/darkreader/releases',
        method: 'GET',
        responseType: 'json',
      });
  
      const asset = res.data[0].assets.find(x => x.name === 'build.zip')
        .browser_download_url;
  
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
    }
  });
} catch (e) {
  console.error(e);
  process.exit(-1);
}

