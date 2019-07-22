import { searchElements, isVisible } from './dom';
import { formFieldFilters } from '../constants';
import { IFormFillData } from '~/interfaces';

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
    const value = getFieldValue(name, data);

    if (value) {
      el.value = value;
    }
  }
}

const getFieldValue = (name: string, data: IFormFillData) => {
  const { fields } = data;
  const fullName = (fields.name || '').split(' ');

  try {
    switch (name) {
      case 'username':
        return fields.username;
      case 'login':
        return fields.username;
      case 'email':
        return fields.email;
      case 'password':
        return fields.password;
      case 'name': // full name
        return fields.name;
      case 'fname': // first name
        return fullName[0];
      case 'mname':  // middle name
        return fullName.length >= 3 && fullName[fullName.length - 2];
      case 'lname':// last name
        return fullName[fullName.length - 1];
      case 'address':
        return fields.address;
      case 'city':
        return fields.city;
      case 'postal':
        return fields.postCode;
      case 'country':
        return fields.country;
      case 'phone':
        return fields.phone;
      case 'mobile':
        return fields.phone;
    }
  } catch (err) {

  }

  return null;
}
