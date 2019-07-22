import { searchElements, isVisible } from './dom';
import { formFieldFilters } from '../constants';
import { IFormFillData } from '~/interfaces';
import { getAutoCompleteValue } from '~/utils/auto-complete';

export type FormField = HTMLInputElement | HTMLSelectElement;

export const getFormFields = (form: HTMLFormElement) => {
  const formId = form.getAttribute('id');
  const inside = searchElements(form, 'input, select');
  const outside = formId != null ? searchElements(document, `input[form=${formId}], select[form=${formId}]`) : [];

  return filterFormFields(...inside, ...outside);
}

export const filterFormFields = (...inputs: HTMLElement[]) => {
  return inputs.filter(el => validateField(el)) as FormField[];
}

export const validateField = (el: HTMLElement) => {
  const { name, type } = formFieldFilters;
  const nameValid = name.test(el.getAttribute('name'));
  const typeValid = type.test(el.getAttribute('type')) || el instanceof HTMLSelectElement;

  return isVisible(el) && nameValid && typeValid;
}

export const insertFieldValue = (el: FormField, data: IFormFillData) => {
  const autoComplete = el.getAttribute('autocomplete');

  if (autoComplete !== 'off') {
    const name = el.getAttribute('name');
    const value = getAutoCompleteValue(name, data);

    if (value) {
      el.value = value;
    }
  }
}
