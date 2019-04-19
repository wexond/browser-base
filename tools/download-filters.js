const Axios = require('axios');
const { writeFile, existsSync, mkdirSync } = require('fs');

if (!existsSync('filters')) {
  mkdirSync('filters');
}

if (!existsSync('filters/default.dat')) {
  console.log('Downloading default filter cache...');

  Axios.request({
    url: 'https://wexond.net/filters/default.dat',
    responseType: 'arraybuffer',
    method: 'get',
  }).then(({ data }) => {
    console.log('Writing cache to ./filters/default.dat...');

    writeFile('filters/default.dat', data, err => {
      if (err) return console.error(err);
    });
  });
}
