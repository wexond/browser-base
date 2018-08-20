import { databases } from '~/defaults/databases';
import { Favicon } from '~/interfaces';

export class FaviconsStore {
  public favicons: { [key: string]: string } = {};

  public load() {
    return new Promise(async resolve => {
      databases.favicons.find({}, (err: any, docs: Favicon[]) => {
        if (err) return console.warn(err);

        docs.forEach(favicon => {
          if (
            this.favicons[favicon.url] == null &&
            favicon.favicon.byteLength !== 0
          ) {
            this.favicons[favicon.url] = window.URL.createObjectURL(
              new Blob([favicon.favicon]),
            );
          }
        });
      });
    });
  }
}
