export interface FormFillData {
  _id?: string;
  type: 'password' | 'address';
  fields?: FormFillPassword | FormFillAddress;
}

export interface FormFillPassword {
  username?: string;
  password?: string;
  url?: string;
}

export interface FormFillAddress {
  name?: string;
  address?: string;
  postCode?: string;
  city?: string;
  phone?: string;
  email?: string;
}
