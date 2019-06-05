import { StorageArea } from '.';
import { IpcExtension } from '~/shared/models';

export interface Extension extends IpcExtension {
  databases?: {
    [key: string]: StorageArea;
    local: StorageArea;
    sync: StorageArea;
    managed: StorageArea;
  };
}
