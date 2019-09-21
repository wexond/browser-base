import { observable } from 'mobx';

import { IHistoryItem } from '~/interfaces';
import { Database } from '~/models/database';

export class HistoryStore {
  public db = new Database<IHistoryItem>('history');

  @observable
  public items: IHistoryItem[] = [];

  public getById(id: string): IHistoryItem {
    return this.items.find(x => x._id === id);
  }

  public async addItem(item: IHistoryItem) {
    const doc = await this.db.insert(item);
    item._id = doc._id;
    this.items.push(item);
    return doc._id;
  }
}
