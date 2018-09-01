import { observable } from 'mobx';
import store from '.';
import { HistoryItem, HistorySection } from '~/interfaces';
import { formatDate } from '~/utils';
import { databases } from '~/defaults/databases';

export class HistoryStore {
  @observable
  public historyItems: HistoryItem[] = [];

  public getById(id: string) {
    return this.historyItems.find(x => x._id === id);
  }

  public load() {
    return new Promise(async resolve => {
      databases.history
        .find({})
        .sort({ date: 1 })
        .exec((err: any, items: HistoryItem[]) => {
          if (err) return console.warn(err);

          this.historyItems = items;
          resolve();
        });
    });
  }

  public addItem(item: HistoryItem) {
    return new Promise((resolve: (id: string) => void) => {
      databases.history.insert(item, (err: any, doc: HistoryItem) => {
        if (err) return console.warn(err);

        this.historyItems.push(doc);
        resolve(doc._id);
      });
    });
  }
}
