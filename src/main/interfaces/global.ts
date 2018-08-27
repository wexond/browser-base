import { Manifest } from '../../interfaces/manifest';
import { StorageArea } from '~/main/models/storage-area';
import { ExtensionsLocale, ExtensionsAlarm } from '~/interfaces';

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
  extensionsLocales: {
    [key: string]: ExtensionsLocale;
  };
  extensionsAlarms: {
    [key: string]: ExtensionsAlarm[];
  };
  locale: string;
}
