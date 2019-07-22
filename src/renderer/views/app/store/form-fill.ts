import { ipcRenderer } from 'electron';
import { observable } from 'mobx';
import * as Datastore from 'nedb';
import { promisify } from 'util';

import { IBookmark, IFormFillData, IFormFillItem } from '~/interfaces';
import { getPath } from '~/utils/paths';
import { getAutoCompleteValue } from '~/utils/auto-complete';

export class FormFillStore {
  public db = new Datastore({
    filename: getPath('storage/form-fill.db'),
    autoload: true,
  });

  @observable
  public list: IFormFillData[] = [
    {
      _id: 'a',
      type: 'address',
      fields: {
        name: 'Big Skrrt Krzak',
        address: 'Krzakowska 21',
        postCode: '18-07',
        city: 'Krzakowo',
        country: 'pl',
        phone: '123 456 789',
        email: 'bigkrzak@wexond.net',
      },
    },
  ];

  constructor() {
    ipcRenderer.on('autocomplete-request-items', (e: any, name: string) => {
      const items: IFormFillItem[] = this.list.map(item => {
        const val = getAutoCompleteValue(name, item);
        return val && {
          _id: item._id,
          text: val,
        };
      }).filter(r => r);

      ipcRenderer.send('autocomplete-request-items', items);
    });
  }
}
