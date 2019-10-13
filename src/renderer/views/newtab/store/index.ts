import { observable, computed } from 'mobx';
import { ISettings, IFavicon, ITheme, IHistoryItem } from '~/interfaces';
import { getTheme } from '~/utils/themes';
import { PreloadDatabase } from '~/preloads/models/database';
import { countVisitedTimes } from '~/utils/history';
import { NEWS_API_KEY } from '../../app/constants';
import { requestURL } from '~/utils/network';
import { INewsItem } from '~/interfaces/news-item';

export class Store {
  @observable
  public settings: ISettings = { ...(window as any).settings };

  @computed
  public get theme(): ITheme {
    return getTheme(this.settings.theme);
  }

  @observable
  public favicons: Map<string, string> = new Map();

  @observable
  public items: IHistoryItem[] = [];

  @observable
  public news: INewsItem[] = [];

  @observable
  public image = '';

  @computed
  public get topSites(): IHistoryItem[] {
    const top1 = countVisitedTimes(this.items);
    const newItems: IHistoryItem[] = [];

    for (const item of top1) {
      newItems.push(item.item);
    }

    return newItems.slice(0, 8);
  }

  public faviconsDb = new PreloadDatabase<IFavicon>('favicons');
  public historyDb = new PreloadDatabase<IHistoryItem>('history');

  public constructor() {
    this.loadFavicons();
    this.load();

    const image = new Image();
    const src = 'https://picsum.photos/1920/1080';

    image.onload = () => {
      this.image = src;

      setTimeout(() => {
        this.loadNews();
      });
    };
    image.src = src;

    if (image.complete) {
      this.image = src;
    }
  }

  public async loadNews() {
    const { data } = await requestURL(
      `https://newsapi.org/v2/everything?q=a&pageSize=10&language=en&apiKey=${NEWS_API_KEY}`,
    );

    const json = JSON.parse(data);

    this.news = json.articles;
  }

  public async loadFavicons() {
    (await this.faviconsDb.get({})).forEach(favicon => {
      const { data } = favicon;

      if (this.favicons.get(favicon.url) == null) {
        this.favicons.set(favicon.url, data);
      }
    });
  }

  public async load() {
    const items = await this.historyDb.get({});

    items.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    this.items = items;
  }
}

export default new Store();
