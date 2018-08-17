export class FaviconsStore {
  public favicons: { [key: string]: string } = {};

  public load() {
    // TODO: nedb
    /*return new Promise(async resolve => {
      await database.favicons.each(favicon => {
        if (
          this.favicons[favicon.url] == null &&
          favicon.favicon.byteLength !== 0
        ) {
          this.favicons[favicon.url] = window.URL.createObjectURL(
            new Blob([favicon.favicon]),
          );
        }
      });
      resolve();
    });*/
  }
}
