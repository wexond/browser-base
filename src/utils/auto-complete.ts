import { IFormFillData } from '~/interfaces';

export const getAutoCompleteValue = (name: string, data: IFormFillData) => {
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
