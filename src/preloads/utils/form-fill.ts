import { searchElements, isVisible } from './dom';
import { formFieldFilters } from '../constants';
import { IFormFillData } from '~/interfaces';
import { getFormFillValue } from '~/utils/form-fill';

export type FormField = HTMLInputElement | HTMLSelectElement;

export const getFormFields = (form: HTMLFormElement) => {
  const formId = form.getAttribute('id');
  const inside = searchElements(form, 'input, select');
  const outside = formId != null ? searchElements(document, `input[form=${formId}], select[form=${formId}]`) : [];

  return [...inside, ...outside].filter(el => validateField(el)) as FormField[];
}

export const validateField = (el: HTMLElement) => {
  const { name, type } = formFieldFilters;
  const isNameValid = name.test(el.getAttribute('name'));
  const isTypeValid = type.test(el.getAttribute('type')) || el instanceof HTMLSelectElement;

  return isVisible(el) && isNameValid && isTypeValid;
}

export const insertFieldValue = (el: FormField, data: IFormFillData) => {
  const autoComplete = el.getAttribute('autocomplete');

  if (autoComplete !== 'off') {
    const name = el.getAttribute('name');
    const value = getFormFillValue(name, data);

    el.value = value || '';
  }
}
