import * as Datastore from 'nedb';

import { Favicon } from '../models';
import { getPath } from '~/shared/utils/paths';
import { requestURL } from '../utils/network';

const got = require('got');
const icojs = require('icojs');
const fileType = require('file-type');

const convertIcoToPng = (icoData: Buffer) => {
  return new Promise((resolve: (b: Buffer) => void) => {
    icojs.parse(icoData, 'image/png').then((images: any) => {
      resolve(images[0].buffer);
    });
  });
};

const readImage = (buffer: Buffer) => {
  return new Promise((resolve: (b: Buffer) => void) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(Buffer.from(reader.result as any));
    };

    reader.readAsArrayBuffer(new Blob([buffer]));
  });
};

export class FaviconsStore {
  public db = new Datastore({
    filename: getPath('storage/favicons.db'),
    autoload: true,
  });

  public favicons: { [key: string]: string } = {};
  public faviconsBuffers: { [key: string]: Buffer } = {};

  constructor() {
    this.load();
  }

  public getFavicons = (query: Favicon = {}) => {
    return new Promise((resolve: (favicons: Favicon[]) => void, reject) => {
      this.db.find(query, (err: any, docs: Favicon[]) => {
        if (err) return reject(err);
        resolve(docs);
      });
    });
  };

  public addFavicon = async (url: string) => {
    return new Promise(async (resolve: (a: any) => void) => {
      if (!this.favicons[url]) {
        const data = Buffer.from(await requestURL(url), 'binary');
        let img = data;

        if (fileType(data).ext === 'ico') {
          img = await convertIcoToPng(img);
        }

        const buffer = await readImage(img);

        this.db.insert({
          url,
          data: JSON.stringify(buffer),
        });

        this.favicons[url] = window.URL.createObjectURL(new Blob([buffer]));
        this.faviconsBuffers[url] = buffer;
        resolve({ url: this.favicons[url], data: buffer });
      } else {
        resolve({ url: this.favicons[url], data: this.faviconsBuffers[url] });
      }
    });
  };

  public async load() {
    await this.db.find({}, (err: any, docs: Favicon[]) => {
      if (err) return console.warn(err);

      docs.forEach(favicon => {
        const data = Buffer.from(JSON.parse(favicon.data).data);
        if (this.favicons[favicon.url] == null && data.byteLength !== 0) {
          this.favicons[favicon.url] = window.URL.createObjectURL(
            new Blob([data]),
          );
          this.faviconsBuffers[favicon.url] = data;
        }
      });
    });
  }
}
