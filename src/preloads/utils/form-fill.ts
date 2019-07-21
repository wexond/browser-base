import { searchElements, isVisible } from './dom';
import { formInputFilters } from '../constants';

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
