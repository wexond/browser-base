import { ipcRenderer } from 'electron';

import { Form } from './form';
import { searchElements } from '../utils';
import { IFormFillData } from '~/interfaces';

export class AutoComplete {
  public forms: Form[] = [];

  public currentForm: Form;

  constructor() {
    ipcRenderer.on('form-fill-set', (e: any, data: IFormFillData) => {
      if (this.currentForm != null) {
        this.currentForm.insertData(data);
      }
    });
  }

  public loadForms = () => {
    const forms = <HTMLFormElement[]>searchElements(document, 'form');

    this.forms = forms.map(el => new Form(el));
  }
}

export default new AutoComplete();
