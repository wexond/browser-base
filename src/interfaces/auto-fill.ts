export type IAutoFillType = 'password' | 'address';

export interface IAutoFillItem {
  _id?: string;
  type?: IAutoFillType;
  data?: IAutoFillCredentialsData | IAutoFillAddressData;
  favicon?: any;
  url?: string;
}

export interface IAutoFillCredentialsData {
  username?: string;
  password?: string;
  passwordLength?: number;
}

export interface IAutoFillAddressData {
  name?: string;
  organization?: string;
  address?: string;
  postCode?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
}

export interface IAutoFillMenuData {
  type?: IAutoFillType;
  items?: IAutoFillMenuItem[];
}

export interface IAutoFillMenuItem {
  _id?: string;
  label?: string;
  sublabel?: string;
  favicon?: any;
}

export interface IAutoFillMenuPosition {
  height: number;
  x: number;
  y: number;
}
