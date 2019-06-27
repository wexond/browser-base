import * as Datastore from 'nedb';
import { observable, computed, action } from 'mobx';
import { HistoryItem, HistorySection } from '../models';
import { getPath } from '~/shared/utils/paths';
import { countVisitedTimes, compareDates, getSectionLabel } from '../utils';

export type QuickRange =
  | 'all'
  | 'today'
  | 'yesterday'
  | 'last-week'
  | 'last-month'
  | 'older';

export class HistoryStore {
  public db = new Datastore({
    filename: getPath('storage/history.db'),
    autoload: true,
  });

  @observable
  public items: HistoryItem[] = [];

  @observable
  public itemsLoaded = this.getDefaultLoaded();

  @observable
  public selectedRange: QuickRange = 'all';

  @observable
  public searched = '';

  @observable
  public selectedItems: string[] = [];

  @computed
  public get topSites() {
    const top1 = countVisitedTimes(this.items);
    const newItems: HistoryItem[] = [];

    for (const item of top1) {
      if (item.times > 1) {
        newItems.push(item.item);
      }
    }

    return newItems.slice(0, 12);
  }

  constructor() {
    this.load();
  }

  public resetLoadedItems() {
    this.itemsLoaded = this.getDefaultLoaded();
  }

  public getById(id: string) {
    return this.items.find(x => x._id === id);
  }

  public async load() {
    await this.db.find({}).exec((err: any, items: HistoryItem[]) => {
      if (err) return console.warn(err);

      items = items.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      this.items = items;
    });
  }

  public addItem(item: HistoryItem) {
    return new Promise((resolve: (id: string) => void) => {
      this.db.insert(item, (err: any, doc: HistoryItem) => {
        if (err) return console.error(err);

        this.items.push(doc);
        resolve(doc._id);
      });
    });
  }

  public clear() {
    this.items = [];

    this.db.remove({}, { multi: true }, (err, num) => {});
  }

  public removeItem(id: string) {
    this.items = this.items.filter(x => x._id !== id);

    this.db.remove({ _id: id }, err => {
      if (err) return console.warn(err);
    });
  }

  @computed
  public get sections() {
    const list: HistorySection[] = [];
    let section: HistorySection;
    let loaded = 0;

    for (let i = this.items.length - 1; i >= 0; i--) {
      if (loaded > this.itemsLoaded) break;

      const item = this.items[i];
      const date = new Date(item.date);

      if (
        this.searched !== '' &&
        !item.title.toLowerCase().includes(this.searched) &&
        !item.url.includes(this.searched)
      ) {
        continue;
      }

      if (this.range) {
        if (date.getTime() >= this.range.max) continue;
        if (date.getTime() <= this.range.min) break;
      }

      if (compareDates(section && section.date, date)) {
        section.items.push(item);
      } else {
        section = {
          label: getSectionLabel(date),
          items: [item],
          date,
        };
        list.push(section);
      }

      loaded++;
    }

    return list;
  }

  @computed
  public get range() {
    const current = new Date();
    const day = current.getDate();
    const month = current.getMonth();
    const year = current.getFullYear();

    let minDate: Date;
    let maxDate: Date;

    switch (this.selectedRange) {
      case 'today': {
        minDate = new Date(year, month, day, 0, 0, 0, 0);
        maxDate = new Date(year, month, day, 23, 59, 59, 999);
        break;
      }
      case 'yesterday': {
        minDate = new Date(year, month, day - 1, 0, 0, 0, 0);
        maxDate = new Date(year, month, day - 1, 23, 59, 59, 999);
        break;
      }
      case 'last-week': {
        let currentDay = current.getDay() - 1;
        if (currentDay === -1) currentDay = 6;
        minDate = new Date(year, month, day - currentDay - 7, 0, 0, 0, 0);
        maxDate = new Date(year, month, day - currentDay - 1, 0, 0, 0, 0);
        break;
      }
      case 'last-month': {
        minDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
        maxDate = new Date(year, month, 0, 0, 0, 0, 0);
        break;
      }
      case 'older': {
        let currentDay = current.getDay() - 1;
        if (currentDay === -1) currentDay = 6;
        minDate = new Date(0);
        maxDate = new Date(year, month, day - currentDay - 7, 0, 0, 0, 0);
        break;
      }
    }

    return (
      this.selectedRange !== 'all' && {
        min: minDate.getTime(),
        max: maxDate.getTime(),
      }
    );
  }

  @action
  public search(str: string) {
    this.searched = str.toLowerCase().toLowerCase();
    this.itemsLoaded = this.getDefaultLoaded();
  }

  public getDefaultLoaded() {
    return Math.floor(window.innerHeight / 56);
  }

  @action
  public deleteSelected() {
    for (const item of this.selectedItems) {
      this.removeItem(item);
    }
    this.selectedItems = [];
  }
}
