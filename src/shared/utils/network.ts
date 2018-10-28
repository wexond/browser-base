import axios from 'axios';

export const requestURL = (url: string) =>
  new Promise((resolve: (data: any) => void, reject) => {
    let adapter: any = require('axios/lib/adapters/xhr');

    if (process) {
      adapter = require('axios/lib/adapters/http');
    }

    axios({ method: 'get', url, headers: {}, adapter })
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        console.error(e);
      });
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
