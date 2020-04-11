export type IAutoFillType = 'password' | 'address';

export interface IAutoFillItem {
  id?: string;
  type?: IAutoFillType;
  data?: IAutoFillPasswordData | IAutoFillAddressData;
  favicon?: any;
}

export interface IAutoFillPasswordData {
  url?: string;
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

export interface IAutoFillSavePayload {
  oldUsername?: string;
  username?: string;
  password?: string;
  update?: boolean;
}
