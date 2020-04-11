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
