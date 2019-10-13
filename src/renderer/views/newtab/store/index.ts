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

  private page = 1;
  private loaded = true;

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
    this.loadImage();

    let loaded = true;

    const interval = setInterval(async () => {
      if (document.body.scrollHeight > document.body.clientHeight)
        return clearInterval(interval);

      if (loaded) {
        loaded = false;
        await this.loadNews();
        loaded = true;
      }
    }, 200);

    window.onscroll = () => {
      this.updateNews();
    };

    window.onresize = () => {
      this.updateNews();
    };
  }

  public async loadImage() {
    let url = 'https://picsum.photos/1920/1080';
    let isNewUrl = true;
    const dateString = localStorage.getItem('imageDate');

    if (dateString && dateString !== '') {
      const date = new Date(dateString);
      const date2 = new Date();
      const diffTime = Math.floor(
        (date2.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
      );
      const newUrl = localStorage.getItem('imageURL');

      if (diffTime < 1 && newUrl) {
        url = newUrl;
        isNewUrl = false;
      }
    }

    fetch(url)
      .then(response => Promise.all([response.url, response.blob()]))
      .then(([resource, blob]) => {
        this.image = URL.createObjectURL(blob);

        return resource;
      })
      .then(imgUrl => {
        if (isNewUrl) {
          localStorage.setItem('imageURL', imgUrl);
          localStorage.setItem('imageDate', new Date().toString());
        }
      });
  }

  public async updateNews() {
    const scrollPos = window.scrollY;
    const scrollMax =
      document.body.scrollHeight - document.body.clientHeight - 768;

    if (scrollPos >= scrollMax && this.loaded && this.page !== 10) {
      this.page++;
      this.loaded = false;
      await this.loadNews();
      this.loaded = true;
    }
  }

  public async loadNews() {
    const { data } = await requestURL(
      `https://newsapi.org/v2/everything?q=a&pageSize=10&page=${this.page}&language=en&apiKey=${NEWS_API_KEY}`,
    );

    const json = JSON.parse(data);

    this.news = this.news.concat(json.articles);
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
