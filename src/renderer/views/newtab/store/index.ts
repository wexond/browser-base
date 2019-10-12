import { observable, computed } from 'mobx';
import { ISettings, IFavicon, ITheme } from '~/interfaces';
import { getTheme } from '~/utils/themes';
import { PreloadDatabase } from '~/preloads/models/database';

export class Store {
  @observable
  public settings: ISettings = { ...(window as any).settings };

  @computed
  public get theme(): ITheme {
    return getTheme(this.settings.theme);
  }

  @observable
  public favicons: Map<string, string> = new Map();

  public faviconsDb = new PreloadDatabase<IFavicon>('favicons');

  public constructor() {
    this.loadFavicons();
  }

  public async loadFavicons() {
    (await this.faviconsDb.get({})).forEach(favicon => {
      const { data } = favicon;

      if (this.favicons.get(favicon.url) == null) {
        this.favicons.set(favicon.url, data);
      }
    });
  }
}

export default new Store();
