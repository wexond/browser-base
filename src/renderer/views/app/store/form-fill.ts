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
    {
      _id: 'b',
      type: 'address',
      fields: {
        name: 'Janush Kowalski',
        address: 'Sandalowa 12',
        postCode: '155-17',
        city: 'Gdańsk',
        country: 'pl',
        phone: '400 500 600',
        email: 'janushkowalski@wexond.net',
      },
    },
    {
      _id: 'c',
      type: 'address',
      fields: {
        name: 'Jan Smith',
        address: 'Zimna -5',
        postCode: '1000-18',
        city: 'New York',
        country: 'us',
        phone: '100 200 300',
        email: 'jansmith@wexond.net',
      },
    },
    {
      _id: 'd',
      type: 'address',
      fields: {
        name: 'Random Person',
        address: 'Ciekawa 11',
        postCode: '0000-11',
        city: 'Warszawa',
        country: 'pl',
        phone: '101 202 303',
        email: 'randomperson@wexond.net',
      },
    },
    {
      _id: 'e',
      type: 'address',
      fields: {
        name: 'Unexpected Wind',
        address: 'Wiatrowa 9',
        postCode: '1234-56',
        city: 'Elopo',
        country: 'pl',
        phone: '555 111 777',
        email: 'unexpectedperson@wexond.net',
      },
    },
  ];

  constructor() {
    ipcRenderer.on('autocomplete-request-items', (e: any, name: string) => {
      const items = this.list.map(item => {
        const val = getAutoCompleteValue(name, item);

        return val && {
          _id: item._id,
          text: val,
        } as IFormFillItem;
      }).filter(r => r);

      ipcRenderer.send('autocomplete-request-items', items);
    });
  }
}
