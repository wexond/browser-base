import { IHistoryItem } from '~/interfaces';
import { Database } from '~/models/database';

export class HistoryStore {
  public db = new Database<IHistoryItem>('history');

  public async addItem(item: IHistoryItem) {
    const doc = await this.db.insert(item);
    item._id = doc._id;
    return doc._id;
  }
}
