import { databases } from '~/defaults/databases';
import { Favicon } from '~/interfaces';

export class FaviconsStore {
  public favicons: { [key: string]: string } = {};

  public getFavicons = (query: Favicon = {}) => {
    return new Promise((resolve: (favicons: Favicon[]) => void, reject) => {
      databases.favicons.find(query, (err: any, docs: Favicon[]) => {
        if (err) return reject(err);
        resolve(docs);
      });
    });
  };

  public addFavicon = async (url: string) => {
    const favicons = await this.getFavicons({ url });

    if (favicons.length === 0) {
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = () => {
            const generatedBuffer: any = reader.result;

            databases.favicons.insert({
              url,
              data: JSON.stringify(Buffer.from(generatedBuffer)),
            });
          };
          reader.readAsArrayBuffer(blob);
        });
    }
  };

  public load() {
    return new Promise(async resolve => {
      databases.favicons.find({}, (err: any, docs: Favicon[]) => {
        if (err) return console.warn(err);

        docs.forEach(favicon => {
          const data = Buffer.from(JSON.parse(favicon.data).data);
          if (this.favicons[favicon.url] == null && data.byteLength !== 0) {
            this.favicons[favicon.url] = window.URL.createObjectURL(
              new Blob([data]),
            );
          }
        });

        resolve();
      });
    });
  }
}
