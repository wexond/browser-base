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
    const favicons = await this.getFavicons({ url });

    if (favicons.length === 0) {
      const { data } = await Axios.get(url, {
        responseType: 'arraybuffer',
        adapter,
      });

      const reader = new FileReader();

      reader.onload = () => {
        const generatedBuffer: any = reader.result;

        const buf = Buffer.from(generatedBuffer);
        const data = JSON.stringify(buf);

        this.db.insert({
          url,
          data,
        });

        this.favicons[url] = window.URL.createObjectURL(new Blob([buf]));
      };

      reader.readAsArrayBuffer(new Blob([data]));
    }
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
        }
      });
    });
  }
}
