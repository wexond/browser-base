export interface IOperation {
  scope: string;
}

export interface IFindOperation extends IOperation {
  query: any;
}

export interface IInsertOperation extends IOperation {
  item: any;
}

export interface IRemoveOperation extends IFindOperation {
  multi?: boolean;
}

export interface IUpdateOperation extends IFindOperation, IRemoveOperation {
  value: any;
}

export interface IStorageMessage {
  id: string;
  scope: IStorageScope;
  method: string;
  args?: any | any[];
}

export type IStorageScope = 'bookmarks';

export interface IStorageResponse {
  id: string;
  data: any;
  error?: Error;
  success?: boolean;
}
