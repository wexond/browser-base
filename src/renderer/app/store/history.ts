import * as Datastore from 'nedb';
import { observable } from 'mobx';
import { HistoryItem } from '../models';
import { getPath } from '~/shared/utils/paths';

export class HistoryStore {
  public db = new Datastore({
    filename: getPath('storage/history.db'),
    autoload: true,
  });

  @observable
  public historyItems: HistoryItem[] = [];

  constructor() {
    this.load();
  }

  public getById(id: string) {
    return this.historyItems.find(x => x._id === id);
  }

  public async load() {
    await this.db
      .find({})
      .sort({ date: 1 })
      .exec((err: any, items: HistoryItem[]) => {
        if (err) return console.warn(err);

        this.historyItems = items;
      });
  }

  public addItem(item: HistoryItem) {
    return new Promise((resolve: (id: string) => void) => {
      this.db.insert(item, (err: any, doc: HistoryItem) => {
        if (err) return console.warn(err);

        this.historyItems.push(doc);
        resolve(doc._id);
      });
    });
  }

  public removeItem(id: string) {
    this.historyItems = this.historyItems.filter(x => x._id !== id);

    this.db.remove({ _id: id }, err => {
      if (err) return console.warn(err);
    });
  }
}
