import * as http from 'http';
import * as https from 'https';
import { parse } from 'url';

interface Data extends http.IncomingMessage {
  data: string;
}

export const requestURL = (url: string): Promise<Data> =>
  new Promise((resolve, reject) => {
    const options = parse(url);

    let { request } = http;

    if (options.protocol === 'https:') {
      request = https.request;
    }

    const req = request(options, (res) => {
      let data = '';
      res.setEncoding('binary');

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const d: any = { ...res, data };
        resolve(d);
      });

      res.on('error', (e) => {
        reject(e);
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
