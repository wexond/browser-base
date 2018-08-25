import { Manifest } from '../../interfaces/manifest';
import { StorageArea } from '~/main/models/storage-area';

export interface Global {
  extensions: {
    [key: string]: Manifest;
  };
  backgroundPages: {
    [key: string]: {
      html: Buffer;
      name: string;
      webContentsId: number;
    };
  };
  databases: {
    [key: string]: {
      [key: string]: StorageArea;
    };
  };
  locale: string;
}
