import { ipcRenderer } from 'electron';

import { Form } from './form';
import { searchElements } from '../utils';
import { IFormFillData } from '~/interfaces';

export class AutoComplete {
  public forms: Form[] = [];

  public currentForm: Form;

  public visible = false;

  constructor() {
    ipcRenderer.on(
      'form-fill-update',
      (e: any, data: IFormFillData, persistent: boolean) => {
        if (!this.currentForm) return;

        this.currentForm.insertData(data, persistent);

        if (data && persistent) {
          this.currentForm.data = data;
        }
      },
    );
  }

  public loadForms = () => {
    const forms = <HTMLFormElement[]>searchElements(document, 'form');

    this.forms = forms.map(el => new Form(el));
  };

  public onWindowMouseDown = () => {
    this.hide();
  };

  public hide() {
    if (this.visible) {
      this.visible = false;
      ipcRenderer.send('form-fill-hide');
    }
  }
}

export default new AutoComplete();
