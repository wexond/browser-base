import * as Datastore from 'nedb';
import { observable, computed } from 'mobx';
import { promisify } from 'util';
import { getPath } from '~/utils/paths';
import { IBookmark, IFormFillData } from '~/interfaces';

export class FormFillStore {
  public db = new Datastore({
    filename: getPath('storage/form-fill.db'),
    autoload: true,
  });

  @observable
  public list: IBookmark[] = [];

  constructor() {
    this.load();
  }

  public async load() {
    const cursor = this.db.find({});
    const items: IFormFillData[] = await promisify(cursor.exec.bind(cursor))();

    this.list = items;
  }
}
