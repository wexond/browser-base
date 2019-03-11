import { ipcRenderer } from 'electron';
import { IpcExtension } from '~/shared/models';
import { getAPI } from '~/shared/utils/extensions';
import { parse } from 'url';

ipcRenderer.setMaxListeners(0);

declare const global: any;

process.once('loaded', () => {
  const extensionId = parse(window.location.href).hostname;

  const extension: IpcExtension = ipcRenderer.sendSync(
    'get-extension',
    extensionId,
  );

  const api = getAPI(extension);

  global.wexond = api;
  global.chrome = api;
  global.browser = api;
});
