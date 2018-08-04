import { remote } from 'electron';
import { parse } from 'url';

import { getAPI } from './api';

process.once('loaded', () => {
  const extensions = remote.getGlobal('extensions');
  const extensionId = parse(window.location.href).hostname;
  const api = getAPI(extensions[extensionId]);

  interface Global extends NodeJS.Global {
    wexond?: typeof api;
    chrome?: typeof api;
    browser?: typeof api;
  }

  const globalObject = global as Global;

  globalObject.wexond = api;
  globalObject.chrome = api;
  globalObject.browser = api;
});
