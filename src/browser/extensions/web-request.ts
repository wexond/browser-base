import { webContents } from 'electron';
import { EXTENSION_PROTOCOL } from '~/common/constants/protocols';
import extendElectronWebRequest from './extend-web-request';

const requestIsOption = (details: any) => {
  const { method } = details;

  return method === 'OPTIONS';
};

const requestIsFromBackgroundPage = (details: any): boolean => {
  const { webContentsId } = details;

  if (webContentsId) {
    const wc = webContents.fromId(webContentsId);

    if (wc) {
      return wc.getURL().startsWith(EXTENSION_PROTOCOL.scheme);
    }

    return false;
  }

  return false;
};

const requestsOrigins = new Map<number, string>();

const requestIsXhrOrSubframe = (details: any) => {
  const { resourceType } = details;

  const isXhr = resourceType === 'xhr';
  const isSubframe = resourceType === 'subFrame';

  return isXhr || isSubframe;
};

const requestHasExtensionOrigin = (details: any) => {
  const { id } = details;

  const origin = requestsOrigins.get(id);

  if (origin) {
    return origin.startsWith(EXTENSION_PROTOCOL.scheme);
  }

  return false;
};

const requestIsForExtension = (details: any) =>
  requestHasExtensionOrigin(details) && requestIsXhrOrSubframe(details);

export const hookExtensionWebRequestBypass = (session: Electron.Session) => {
  extendElectronWebRequest(session);

  session.webRequest.onBeforeSendHeaders((details, callback) => {
    requestsOrigins.set(details.id, details.requestHeaders.Origin);

    if (
      !requestIsFromBackgroundPage(details) &&
      requestIsForExtension(details) &&
      !requestIsOption(details)
    ) {
      return callback({
        requestHeaders: {
          ...details.requestHeaders,
          Origin: null,
        },
      });
    }

    callback({ requestHeaders: details.requestHeaders });
  });

  session.webRequest.onHeadersReceived((details, callback) => {
    for (const key in details.responseHeaders) {
      const val = details.responseHeaders[key];
      delete details.responseHeaders[key];
      details.responseHeaders[key.toLowerCase()] = val;
    }

    const accessControlAllowOrigin =
      details.responseHeaders['access-control-allow-origin'] || [];
    const allowedOriginIsWildcard = accessControlAllowOrigin.includes('*');

    details.responseHeaders['access-control-allow-credentials'] = ['true'];

    if (requestIsForExtension(details) || allowedOriginIsWildcard) {
      details.responseHeaders['access-control-allow-origin'] = [
        requestsOrigins.get(details.id),
      ];
    }

    requestsOrigins.delete(details.id);

    callback({ responseHeaders: details.responseHeaders });
  });
};
