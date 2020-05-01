import { ipcRenderer } from 'electron';

import { Form } from './form';
import { searchElements } from '../utils';
import { IFormFillData } from '~/interfaces';
import { windowId } from '../view-preload';

export class AutoComplete {
  public forms: Form[] = [];

  public currentForm: Form;

  public visible = false;

  public constructor() {
    requestAnimationFrame(() => {
      ipcRenderer.on(
        `form-fill-update-${windowId}`,
        (e, data: IFormFillData, persistent: boolean) => {
          if (!this.currentForm) return;

          this.currentForm.insertData(data, persistent);

          if (data && persistent) {
            this.currentForm.data = data;
          }
        },
      );
    });
  }

  public loadForms = () => {
    const forms = searchElements(document, 'form') as HTMLFormElement[];

    this.forms = forms.map((el) => new Form(el));
  };

  public onWindowMouseDown = () => {
    this.hide();
  };

  public hide() {
    if (this.visible) {
      this.visible = false;
      ipcRenderer.send(`form-fill-hide-${windowId}`);
    }
  }
}

export default new AutoComplete();
