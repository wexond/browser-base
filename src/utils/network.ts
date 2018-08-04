import https from 'https';
import http from 'http';
import { parse } from 'url';

export const requestURL = (url: string) =>
  new Promise((resolve: (data: string) => void, reject) => {
    const options = parse(url);

    let { request } = http;

    if (options.protocol === 'https:') request = https.request;

    const req = request(options, res => {
      let data = '';
      res.setEncoding('utf-8');

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

/* eslint-disable no-new */
export const loadImage = (url: string) => {
  new Promise((resolve: () => void, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve();
    };

    img.onerror = (e: any) => {
      reject(e);
    };

    img.src = url;
  });
};
/* eslint-enable no-new */

export const hasSubdomain = (url: string) => {
  const regex = new RegExp(/^([a-z]+:\/{2})?([\w-]+\.[\w-]+\.\w+)$/);
  return !!url.match(regex);
};

export const removeSubdomain = (url: string) => url.replace(/^[^.]+\./g, '');
