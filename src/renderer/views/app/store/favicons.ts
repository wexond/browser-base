import * as Datastore from 'nedb';

import { IFavicon } from '~/interfaces';
import { requestURL, getPath } from '~/utils';
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
  public favicons: Map<string, string> = new Map();

  public faviconsBuffers: Map<string, Buffer> = new Map();

  constructor() {
    this.load();
  }

  public getFavicons = (query: IFavicon = {}) => {
    return new Promise((resolve: (favicons: IFavicon[]) => void, reject) => {
      this.db.find(query, (err: any, docs: IFavicon[]) => {
        if (err) return reject(err);
        resolve(docs);
      });
    });
  };

  public addFavicon = async (url: string) => {
    return new Promise(async (resolve: (a: any) => void, reject: any) => {
      if (!this.favicons.get(url)) {
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

          this.favicons.set(url, str);

          resolve(str);
        } catch (e) {
          reject(e);
        }
      } else {
        resolve(this.favicons.get(url));
      }
    });
  };

  public async load() {
    await this.db.find({}, (err: any, docs: IFavicon[]) => {
      if (err) return console.warn(err);

      docs.forEach(favicon => {
        const { data } = favicon;

        if (this.favicons.get(favicon.url) == null) {
          this.favicons.set(favicon.url, data);
        }
      });
    });
  }
}
