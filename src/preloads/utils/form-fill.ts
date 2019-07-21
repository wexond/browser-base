import { searchElements, isVisible } from './dom';
import { formInputFilters } from '../constants';
import { IFormFillData } from '~/interfaces';

export const getFormInputs = (form: HTMLFormElement) => {
  const formId = form.getAttribute('id');
  const inside = searchElements(form, 'input') as HTMLInputElement[];
  const outside = formId != null ? searchElements(document, `input[form=${formId}]`) : [];

  return filterFormInputs(...inside, ...outside);
}

export const filterFormInputs = (...inputs: HTMLElement[] | HTMLInputElement[]) => {
  return inputs.filter(input => {
    const type = input.getAttribute('type');
    const name = input.getAttribute('name');

    return isVisible(input) && formInputFilters.type.test(type) && formInputFilters.name.test(name);
  }) as HTMLInputElement[];
}

export const insertData = (input: HTMLInputElement, data: IFormFillData) => {
  const { fields } = data;
  const name = input.getAttribute('name').toLowerCase().trim();
  const value = getData(name, data);

  if (value) {
    input.value = value;
  }
}

const getData = (name: string, data: IFormFillData) => {
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
