import { IFormFillData } from '~/interfaces';

const getKey = (name: string) => {
  try {
    switch (name) {
      case 'username':
        return 'username';
      case 'login':
        return 'username';
      case 'email':
        return 'email';
      case 'password':
        return 'password';
      case 'name':
        return 'name';
      case 'fname':
        return 'name';
      case 'mname':
        return 'name';
      case 'lname':
        return 'name';
      case 'address':
        return 'address';
      case 'city':
        return 'city';
      case 'postal':
        return 'postCode';
      case 'country':
        return 'country';
      case 'phone':
        return 'phone';
      case 'mobile':
        return 'phone';
    }
  } catch (err) {}

  return null;
};

export const getFormFillValue = (
  name: string,
  data: IFormFillData,
  hidePassword = false,
) => {
  const { fields } = data;
  const fullName = (fields.name || '').split(' ');

  if (name === 'password' && hidePassword) {
    return fields.username || fields.email;
  }

  try {
    switch (name) {
      case 'fname': // first name
        return fullName[0];
      case 'mname': // middle name
        return fullName.length >= 3 && fullName[fullName.length - 2];
      default:
        return fields[getKey(name)];
    }
  } catch (error) {}

  return null;
};

export const getFormFillSubValue = (name: string, data: IFormFillData) => {
  const key = getKey(name);
  const { fields } = data;

  if (data.type === 'address') {
    for (const itemKey in fields) {
      const val: string = (fields as any)[itemKey];

      if (key !== itemKey && val != null) {
        return val;
      }
    }
  } else {
    return '•'.repeat(fields.passLength);
  }

  return null;
};
