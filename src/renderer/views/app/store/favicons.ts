import { IFavicon } from '~/interfaces';
import { requestURL } from '~/utils';
import { observable } from 'mobx';
import { Database } from '~/models/database';
import * as fileType from 'file-type';
import icojs = require('icojs');

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
  public db = new Database<IFavicon>('favicons');

  @observable
  public favicons: Map<string, string> = new Map();

  public constructor() {
    this.load();
  }

  public addFavicon = async (url: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
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
    (await this.db.get({})).forEach(favicon => {
      const { data } = favicon;

      if (this.favicons.get(favicon.url) == null) {
        this.favicons.set(favicon.url, data);
      }
    });
  }
}
