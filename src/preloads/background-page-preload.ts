import { remote, ipcRenderer } from 'electron';
import { parse } from 'url';

import { getAPI } from '@/utils/extensions';

ipcRenderer.setMaxListeners(0);

const extensions = remote.getGlobal('extensions');
const parsed = parse(window.location.href);

if (parsed.protocol !== 'data:') {
  const extensionId = parsed.hostname;

  const manifest = extensions[extensionId];

  const api = getAPI(manifest);

  interface Global extends NodeJS.Global {
    wexond?: typeof api;
    chrome?: typeof api;
    browser?: typeof api;
  }

  const globalObject = global as Global;

  globalObject.wexond = api;
  globalObject.chrome = api;
  globalObject.browser = api;
}
