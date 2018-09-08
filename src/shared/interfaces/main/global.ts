import { Manifest, Locale, Alarm } from '@/interfaces/extensions';
import { StorageArea } from '@/models/main';

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
    [key: string]: Locale;
  };
  extensionsAlarms: {
    [key: string]: Alarm[];
  };
  locale: string;
  userAgent: string;
}
