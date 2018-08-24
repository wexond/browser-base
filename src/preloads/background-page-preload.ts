import { remote } from 'electron';
import { parse } from 'url';

import { getAPI } from './api';
import { getExtensionDatabases } from '~/utils/extensions';

process.once('loaded', () => {
  const extensions = remote.getGlobal('extensions');
  const extensionId = parse(window.location.href).hostname;
  const manifest = extensions[extensionId];
  const api = getAPI(manifest, getExtensionDatabases(manifest));

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
