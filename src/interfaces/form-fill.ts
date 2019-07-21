export interface IFormFillData {
  _id?: string;
  type: 'password' | 'address';
  fields?: IFormFillPassword | IFormFillAddress;
}

export interface IFormFillPassword {
  username?: string;
  password?: string;
  url?: string;
}

export interface IFormFillAddress {
  name?: string;
  address?: string;
  postCode?: string;
  city?: string;
  phone?: string;
  email?: string;
}
