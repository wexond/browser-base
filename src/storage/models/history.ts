import { db } from '../loaders/db';

class HistoryModel {
  public find() {
    const items = db.exec('SELECT * FROM history');

    return items;
  }
}

export default HistoryModel;
