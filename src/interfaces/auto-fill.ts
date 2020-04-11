export type IAutoFillType = 'password' | 'address';

export interface IAutoFillItem {
  id?: string;
  type?: IAutoFillType;
  data?: IAutoFillCredentialsData | IAutoFillAddressData;
  favicon?: any;
  url?: string;
}

export interface IAutoFillCredentialsData {
  username?: string;
  password?: string;
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

export interface IAutoFillMenuItem {
  id?: string;
  label?: string;
  sublabel?: string;
  favicon?: any;
}

export interface IAutoFillMenuPosition {
  height: number;
  x: number;
  y: number;
}
