import { ipcRenderer } from 'electron';
import { observable } from 'mobx';

import { IFormFillData, IFormFillItem } from '~/interfaces';
import { getAutoCompleteValue } from '~/utils/auto-complete';
import { Database } from '../models/database';

export class FormFillStore {
  public db = new Database<IFormFillData>('formfill');

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
      const items: IFormFillItem[] = this.list
        .map(item => {
          const val = getAutoCompleteValue(name, item);
          return (
            val && {
              _id: item._id,
              text: val,
            }
          );
        })
        .filter(r => r);

      ipcRenderer.send('autocomplete-request-items', items);
    });
  }
}
