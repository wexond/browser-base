import * as http from 'http';
import * as https from 'https';
import { parse } from 'url';

export const requestURL = (url: string) =>
  new Promise((resolve: (data: string) => void, reject) => {
    const options: any = parse(url);

    let { request } = http;

    if (options.protocol === 'https:') {
      request = https.request;
    }

    const req = request(options, res => {
      let data = '';
      res.setEncoding('binary');

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    });

    req.on('error', e => {
      reject(e);
    });

    req.end();
  });
