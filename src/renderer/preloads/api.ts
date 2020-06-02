import {
  WEBUI_BASE_URL,
  EXTENSION_PROTOCOL,
} from '~/common/constants/protocols';
import { injectAPI } from '../extensions/injector';

(async () => {
  if (
    !location.href.startsWith(EXTENSION_PROTOCOL.scheme) &&
    !location.href.startsWith(WEBUI_BASE_URL)
  )
    return;
  (process as any).once('document-start', () => {
    injectAPI(location.href.startsWith(WEBUI_BASE_URL));
  });
})();
