import * as Datastore from 'nedb';

import { Favicon } from '../models';
import { getPath } from '~/shared/utils/paths';
import Axios from 'axios';

const adapter = require('axios/lib/adapters/http');

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
        const { data } = await Axios(url, {
          responseType: 'arraybuffer',
          adapter,
        });

        const reader = new FileReader();

        reader.onload = () => {
          const buffer: any = Buffer.from(reader.result as any);
          const newData = JSON.stringify(buffer);

          this.db.insert({
            url,
            data: newData,
          });

          this.favicons[url] = window.URL.createObjectURL(new Blob([buffer]));
          this.faviconsBuffers[url] = buffer;
          resolve({ url: this.favicons[url], data: buffer });
        };

        reader.readAsArrayBuffer(new Blob([data]));
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
