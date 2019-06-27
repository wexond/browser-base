import * as Datastore from 'nedb';

import { Favicon } from '../models';
import { getPath } from '~/shared/utils/paths';
import { requestURL } from '../utils/network';
import { observable } from 'mobx';

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

  @observable
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
    return new Promise(async (resolve: (a: any) => void, reject: any) => {
      if (!this.favicons[url]) {
        try {
          const res = await requestURL(url);

          if (res.statusCode === 404) {
            throw new Error('404 favicon not found');
          }

          let data = Buffer.from(res.data, 'binary');

          const type = fileType(data);

          if (type && type.ext === 'ico') {
            data = await readImage(await convertIcoToPng(data));
          }

          const str = `data:png;base64,${data.toString('base64')}`;

          this.db.insert({
            url,
            data: str,
          });

          this.favicons[url] = str;

          resolve(str);
        } catch (e) {
          reject(e);
        }
      } else {
        resolve(this.favicons[url]);
      }
    });
  };

  public async load() {
    await this.db.find({}, (err: any, docs: Favicon[]) => {
      if (err) return console.warn(err);

      docs.forEach(favicon => {
        const { data } = favicon;

        if (this.favicons[favicon.url] == null) {
          this.favicons[favicon.url] = data;
        }
      });
    });
  }
}
