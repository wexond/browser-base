export type IAutoFillType = 'password' | 'address';

export interface IAutoFillItem {
  id: string;
  type: IAutoFillType;
  data: IAutoFillPasswordData | IAutoFillAddressData;
}

export interface IAutoFillPasswordData {
  url: string;
  username: string;
  password: string;
}

export interface IAutoFillAddressData {
  name: string;
  organization: string;
  address: string;
  postCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
}
