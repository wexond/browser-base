import { BrowserWindow, ipcMain, session, webContents } from 'electron';
import { matchesPattern, makeId } from '~/utils';
import { Global } from '~/main/interfaces';
import { getTabByWebContentsId } from '~/main/utils';

const eventListeners: any = {};

let mainWindow: BrowserWindow;

declare const global: Global;

const getRequestType = (type: string): any => {
  if (type === 'mainFrame') return 'main_frame';
  if (type === 'subFrame') return 'sub_frame';
  if (type === 'cspReport') return 'csp_report';
  return type;
};

const getDetails = (details: any) => {
  return {
    requestId: details.id.toString(),
    url: details.url,
    method: details.method,
    frameId: 0,
    parentFrameId: -1,
    type: getRequestType(details.resourceType),
    timeStamp: Date.now(),
  };
};

const objectToArray = (obj: any) => {
  const arr: any = [];
  Object.keys(obj).forEach(k => {
    if (obj[k]) {
      arr.push({ name: k, value: obj[k] });
    }
  });
  return arr;
};

const arrayToObject = (arr: any[]) => {
  const obj: any = {};
  arr.forEach((item: any) => {
    arr[item.name] = item.value;
  });
  return obj;
};

const matchesFilter = (filter: any, url: string) => {
  if (filter && Array.isArray(filter.urls)) {
    for (const item of filter.urls) {
      if (matchesPattern(item, url)) {
        return true;
      }
    }
  }
  return false;
};

const getCallback = (callback: any) => {
  return function cb(data: any) {
    if (!cb.prototype.callbackCalled) {
      callback(data);
      cb.prototype.callbackCalled = true;
    }
  };
};

const interceptRequest = (
  eventName: string,
  details: any,
  callback: any = null,
) => {
  let isIntercepted = false;

  if (Array.isArray(eventListeners[eventName])) {
    for (const event of eventListeners[eventName]) {
      if (!matchesFilter(event.filters, details.url)) continue;

      const id = makeId(32);

      if (callback) {
        ipcMain.once(
          `api-webRequest-response-${eventName}-${event.id}-${id}`,
          (e: any, res: any) => {
            callback(res);
          },
        );
      }

      const contents = webContents.fromId(event.webContentsId);
      contents.send(
        `api-webRequest-intercepted-${eventName}-${event.id}`,
        details,
        id,
      );

      isIntercepted = true;
    }
  }

  return isIntercepted;
};

export const runWebRequestService = (window: BrowserWindow) => {
  mainWindow = window;

  const webviewRequest = session.fromPartition('persist:webviewsession')
    .webRequest;
  const defaultRequest = session.defaultSession.webRequest;

  session
    .fromPartition('persist:wexond_extension')
    .webRequest.onBeforeSendHeaders((details: any, callback: any) => {
      details.requestHeaders['User-Agent'] = global.userAgent;
      callback({ requestHeaders: details.requestHeaders, cancel: false });
    });

  // onBeforeSendHeaders

  const onBeforeSendHeaders = async (
    details: any,
    callback: any,
    isTabRelated: boolean,
  ) => {
    const requestHeaders = objectToArray(details.requestHeaders);

    const newDetails: any = {
      ...(await getDetails(details)),
      tabId: isTabRelated
        ? (await getTabByWebContentsId(window, details.webContentsId)).id
        : -1,
      requestHeaders,
    };

    const cb = getCallback(callback);

    const isIntercepted = interceptRequest(
      'onBeforeSendHeaders',
      newDetails,
      (res: any) => {
        if (res) {
          if (res.cancel) {
            cb({ cancel: true });
          } else if (res.requestHeaders) {
            const requestHeaders = arrayToObject(res.requestHeaders);
            cb({ requestHeaders, cancel: false });
          }
        }
        cb({ cancel: false, requestHeaders: details.requestHeaders });
      },
    );

    if (!isIntercepted) {
      cb({ cancel: false, requestHeaders: details.requestHeaders });
    }
  };

  defaultRequest.onBeforeSendHeaders(async (details: any, callback: any) => {
    await onBeforeSendHeaders(details, callback, false);
  });

  webviewRequest.onBeforeSendHeaders(async (details: any, callback: any) => {
    details.requestHeaders['User-Agent'] = global.userAgent;
    details.requestHeaders['DNT'] = '1';

    await onBeforeSendHeaders(details, callback, true);
  });

  // onBeforeRequest

  const onBeforeRequest = async (
    details: any,
    callback: any,
    isTabRelated: boolean,
  ) => {
    const newDetails: any = {
      ...(await getDetails(details)),
      tabId: isTabRelated
        ? (await getTabByWebContentsId(window, details.webContentsId)).id
        : -1,
    };
    const cb = getCallback(callback);

    const isIntercepted = interceptRequest(
      'onBeforeRequest',
      newDetails,
      (res: any) => {
        if (res) {
          if (res.cancel) {
            cb({ cancel: true });
          } else if (res.redirectUrl) {
            cb({ cancel: false, redirectURL: res.redirectUrl });
          }
        }
        cb({ cancel: false });
      },
    );

    if (!isIntercepted) {
      cb({ cancel: false });
    }
  };

  defaultRequest.onBeforeRequest(async (details, callback) => {
    await onBeforeRequest(details, callback, false);
  });

  webviewRequest.onBeforeRequest(async (details, callback) => {
    await onBeforeRequest(details, callback, true);
  });

  // onHeadersReceived

  const onHeadersReceived = async (
    details: any,
    callback: any,
    isTabRelated: boolean,
  ) => {
    const responseHeaders = objectToArray(details.responseHeaders);
    const newDetails: any = {
      ...(await getDetails(details)),
      tabId: isTabRelated
        ? (await getTabByWebContentsId(window, details.webContentsId)).id
        : -1,
      responseHeaders,
      statusLine: details.statusLine,
      statusCode: details.statusCode,
    };

    const cb = getCallback(callback);

    const isIntercepted = interceptRequest(
      'onHeadersReceived',
      newDetails,
      (res: any) => {
        if (res) {
          if (res.cancel) {
            cb({ cancel: true });
          } else if (res.responseHeaders) {
            const responseHeaders = Object.assign(
              {},
              details.responseHeaders,
              arrayToObject(res.responseHeaders),
            );
            cb({
              responseHeaders,
              cancel: false,
            });
          }
        }
        cb({ cancel: false, responseHeaders: details.responseHeaders });
      },
    );

    if (!isIntercepted) {
      cb({ cancel: false, responseHeaders: details.responseHeaders });
    }
  };

  defaultRequest.onHeadersReceived(async (details: any, callback: any) => {
    await onHeadersReceived(details, callback, false);
  });

  webviewRequest.onHeadersReceived(async (details: any, callback: any) => {
    await onHeadersReceived(details, callback, true);
  });

  // onSendHeaders

  const onSendHeaders = async (details: any, isTabRelated: boolean) => {
    const requestHeaders = objectToArray(details.requestHeaders);
    const newDetails: any = {
      ...(await getDetails(details)),
      tabId: isTabRelated
        ? await getTabByWebContentsId(window, details.webContentsId)
        : -1,
      requestHeaders,
    };

    interceptRequest('onSendHeaders', newDetails);
  };

  defaultRequest.onSendHeaders(async (details: any) => {
    await onSendHeaders(details, false);
  });

  webviewRequest.onSendHeaders(async (details: any) => {
    await onSendHeaders(details, true);
  });

  // Handle listener add and remove.

  ipcMain.on('api-add-webRequest-listener', (e: any, data: any) => {
    const { id, name, filters } = data;

    const item: any = {
      id,
      filters,
      webContentsId: e.sender.id,
    };

    if (eventListeners[name]) {
      eventListeners[name].push(item);
    } else {
      eventListeners[name] = [item];
    }
  });

  ipcMain.on('api-remove-webRequest-listener', (e: any, data: any) => {
    const { id, name } = data;
    if (eventListeners[name]) {
      eventListeners[name] = eventListeners[name].filter(
        (x: any) => x.id !== id && x.webContentsId !== e.sender.id,
      );
    }
  });
};
