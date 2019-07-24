import { ipcRenderer } from 'electron';

import { formFieldFilters } from '../constants';
import { isVisible, searchElements } from '../utils';
import { getFormFillValue } from '~/utils/form-fill';
import { IFormFillData } from '~/interfaces';
import AutoComplete from './auto-complete';

export type FormField = HTMLInputElement | HTMLSelectElement;

export class Form {
  public changed = false;

  public data: IFormFillData;

  constructor(public ref: HTMLFormElement) {
    this.load();
  }

  public load() {
    for (const field of this.fields) {
      const { menu } = formFieldFilters;
      const isNameValid = menu.test(field.getAttribute('name'));

      if (field instanceof HTMLInputElement && isNameValid) {
        field.addEventListener('focus', this.onFieldFocus);
        field.addEventListener('input', this.onFieldInput);
      }
    }

    this.ref.addEventListener('submit', this.onFormSubmit)
  }

  public get fields() {
    const id = this.ref.getAttribute('id');
    const inside = <FormField[]>searchElements(this.ref, 'input, select');
    const outside = <FormField[]>searchElements(document, `input[form=${id}], select[form=${id}]`);

    return [...inside, ...outside].filter(el => this.validateField(el));
  }

  public validateField(field: FormField) {
    const { name, type } = formFieldFilters;
    const isNameValid = name.test(field.getAttribute('name'));
    const isTypeValid = type.test(field.getAttribute('type')) || field instanceof HTMLSelectElement;

    return isVisible(field) && isNameValid && isTypeValid;
  }

  public insertData(data: IFormFillData) {
    for (const field of this.fields) {
      const autoComplete = this.ref.getAttribute('autocomplete');

      if (autoComplete !== 'off') {
        if (data) {
          const value = getFormFillValue(field.getAttribute('name'), data);
          field.value = value || '';
        } else {
          field.value = '';
        }
      }
    }
  }

  public get usernameField() {
    return this.fields.find(r => {
      const name = r.getAttribute('name');
      return name === 'username' || name === 'login' || 'email';
    });
  }

  public get passwordField() {
    return this.fields.find(r => {
      const typeAttr = r.getAttribute('type');
      const name = r.getAttribute('name');
      return typeAttr === 'password' && name === 'password';
    });
  }

  public onFormSubmit = () => {
    const username = this.usernameField.value;
    const password = this.passwordField.value;

    if (username.length) {
      ipcRenderer.send('credentials-show', username, password);
    }
  }

  public onFieldFocus = (e: FocusEvent) => {
    const field = e.target as HTMLInputElement;
    const rects = field.getBoundingClientRect();

    AutoComplete.currentForm = this;
    AutoComplete.visible = true;

    ipcRenderer.send('form-fill-show', {
      width: rects.width,
      height: rects.height,
      x: Math.floor(rects.left),
      y: Math.floor(rects.top),
    }, field.getAttribute('name'), field.value);
  }

  public onFieldInput = () => {
    AutoComplete.hide();
  }
}
