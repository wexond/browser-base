import { ipcRenderer } from 'electron';

import { formFieldFilters } from '../constants';
import { isVisible, searchElements } from '../utils';
import { getFormFillValue } from '~/utils/form-fill';
import { IFormFillData } from '~/interfaces';
import AutoComplete from './auto-complete';

export type FormField = HTMLInputElement | HTMLSelectElement;

export class Form {
  constructor(public ref: HTMLFormElement) {
    this.load();
  }

  public load() {
    for (const field of this.fields) {
      const { menu } = formFieldFilters;
      const isNameValid = menu.test(field.getAttribute('name'));

      if (field instanceof HTMLInputElement && isNameValid) {
        field.addEventListener('focus', this.onFieldFocus);
        field.addEventListener('blur', this.onFieldBlur);
      }
    }
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
    if (data == null) return; // TODO

    for (const field of this.fields) {
      const autoComplete = this.ref.getAttribute('autocomplete');

      if (autoComplete !== 'off') {
        const name = field.getAttribute('name');
        const value = getFormFillValue(name, data);

        field.value = value || '';
      }
    }
  }

  public onFormSubmit = () => {
    // TODO
  }

  public onFieldFocus = (e: FocusEvent) => {
    const field = e.target as HTMLInputElement;
    const rects = field.getBoundingClientRect();

    AutoComplete.currentForm = this;

    ipcRenderer.send('form-fill-show', {
      width: rects.width,
      height: rects.height,
      x: Math.floor(rects.left),
      y: Math.floor(rects.top),
    }, field.getAttribute('name'));
  }

  public onFieldBlur = () => {
    ipcRenderer.send('form-fill-hide');
  }
}
