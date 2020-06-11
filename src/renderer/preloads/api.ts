import {
  WEBUI_BASE_URL,
  EXTENSION_PROTOCOL,
} from '~/common/constants/protocols';
import { injectAPI } from '../extensions/injector';
import { registerMouseMove } from '../utils/overlay-mouse';
import { getAPI } from '../extensions/api';
import { ipcRenderer } from 'electron';

const type = ipcRenderer.sendSync('get-webcontents-type');

if (type === 'browserView' || type === 'window') {
  window.browser = getAPI('webui');
  registerMouseMove();
}

(async () => {
  if (
    !location.href.startsWith(EXTENSION_PROTOCOL.scheme) &&
    !location.href.startsWith(WEBUI_BASE_URL)
  )
    return;
  (process as any).once('document-start', async () => {
    await injectAPI(location.href.startsWith(WEBUI_BASE_URL));
  });
})();
