export interface IFormFillData {
  _id?: string;
  type: 'password' | 'address';
  fields?: {
    username?: string;
    password?: string;
    url?: string;
    name?: string;
    address?: string;
    postCode?: string;
    city?: string;
    phone?: string;
    email?: string;
    country?: string;
  }
}

export interface IFormFillItem {
  _id?: string;
  text?: string;
  subtext?: string;
}
