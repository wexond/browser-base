const Axios = require('axios');
const { writeFile, existsSync, mkdirSync } = require('fs');
const logUpdate = require('log-update');

const startSpinner = text => {
  const frames = ['-', '\\', '|', '/'];
  let i = 0;

  console.log('');

  logUpdate(`${frames[0]} ${text}`);

  const interval = setInterval(() => {
    const frame = frames[(i = ++i % frames.length)];

    logUpdate(`${frame} ${text}`);
  }, 80);

  return {
    stop: () => {
      clearInterval(interval);
      logUpdate(`Done!`);
    },
  };
};

if (!existsSync('filters')) {
  mkdirSync('filters');
}

if (!existsSync('filters/default.dat')) {
  let spinner = startSpinner('Downloading default filter cache...');

  Axios.request({
    url: 'https://wexond.net/filters/default.dat',
    responseType: 'arraybuffer',
    method: 'get',
  }).then(({ data }) => {
    spinner.stop();

    spinner = startSpinner('Writing cache to ./filters/default.dat...');

    writeFile('filters/default.dat', data, err => {
      if (err) return console.error(err);
      spinner.stop();
    });
  });
}
