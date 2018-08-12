import { app, remote } from 'electron';

export * from './api-ipc-messages';
export * from './ipc-messages';
export * from './api-keys';
export * from './design';

let basePath: string;

if (remote) {
  basePath = remote.app.getAppPath();
} else {
  basePath = app.getAppPath();
}

export const BASE_PATH = basePath;
