import { ipcMain, session, webContents, app } from 'electron';
import { makeId } from '~/shared/utils/string';
import { AppWindow } from '../app-window';
import { matchesPattern } from '~/shared/utils/url';
import { USER_AGENT } from '~/shared/constants';
import { existsSync, readFile } from 'fs';
import console = require('console');
import { resolve } from 'path';
import { appWindow } from '..';

import {
  FiltersEngine,
  makeRequest,
  updateResponseHeadersWithCSP,
  parseFilters,
} from '@cliqz/adblocker';
import { parse } from 'tldts';
import { requestURL } from '~/renderer/app/utils/network';

export let engine: FiltersEngine;

const eventListeners: any = {};

export const loadFilters = async () => {
  const path = resolve(app.getAppPath(), 'filters/default.dat');

  /*const { data } = await requestURL(
    'https://raw.githubusercontent.com/MajkiIT/polish-ads-filter/master/polish-adblock-filters/adblock.txt',
  );*/

  if (existsSync(path)) {
    readFile(resolve(path), (err, buffer) => {
      if (err) return console.error(err);

      engine = FiltersEngine.deserialize(buffer);

      /*const { networkFilters, cosmeticFilters } = parseFilters(
        data,
        engine.config,
      );

      engine.update({
        newNetworkFilters: networkFilters,
        newCosmeticFilters: cosmeticFilters,
      });*/
    });
  }
};

const getTabByWebContentsId = (window: AppWindow, id: number) => {
  for (const key in window.viewManager.views) {
    const view = window.viewManager.views[key];

    if (view.webContents.id === id) {
      return view.tabId;
    }
  }

  return -1;
};

const getRequestType = (type: string): any => {
  if (type === 'mainFrame') return 'main_frame';
  if (type === 'subFrame') return 'sub_frame';
  if (type === 'cspReport') return 'csp_report';
  return type;
};

const getDetails = (details: any, window: AppWindow, isTabRelated: boolean) => {
  const newDetails = {
    ...details,
    requestId: details.id.toString(),
    frameId: 0,
    parentFrameId: -1,
    type: getRequestType(details.resourceType),
    timeStamp: Date.now(),
    tabId: isTabRelated
      ? getTabByWebContentsId(window, details.webContentsId)
      : -1,
    error: '',
  };

  return newDetails;
};

const objectToArray = (obj: any): any[] => {
  const arr: any = [];
  Object.keys(obj).forEach(k => {
    if (obj[k]) {
      arr.push({ name: k, value: obj[k][0] });
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

const matchesFilter = (filter: any, url: string): boolean => {
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

  const defaultRes = {
    cancel: false,
    requestHeaders: details.requestHeaders,
    responseHeaders: details.responseHeaders,
  };

  const cb = getCallback(callback);

  if (Array.isArray(eventListeners[eventName]) && callback) {
    for (const event of eventListeners[eventName]) {
      if (!matchesFilter(event.filters, details.url)) {
        continue;
      }
      const id = makeId(32);

      ipcMain.once(
        `api-webRequest-response-${eventName}-${event.id}-${id}`,
        (e: any, res: any) => {
          if (res) {
            if (res.cancel) {
              return cb({ cancel: true });
            }

            if (res.redirectURL) {
              return cb({
                cancel: false,
                redirectURL: res.redirectUrl,
              });
            }

            if (
              res.requestHeaders &&
              (eventName === 'onBeforeSendHeaders' ||
                eventName === 'onSendHeaders')
            ) {
              const requestHeaders = arrayToObject(res.requestHeaders);
              return cb({ cancel: false, requestHeaders });
            }

            if (res.responseHeaders) {
              const responseHeaders = {
                ...details.responseHeaders,
                ...arrayToObject(res.responseHeaders),
              };

              return cb({
                responseHeaders,
                cancel: false,
              });
            }
          }

          cb(defaultRes);
        },
      );

      const contents = webContents.fromId(event.webContentsId);
      contents.send(
        `api-webRequest-intercepted-${eventName}-${event.id}`,
        details,
        id,
      );

      isIntercepted = true;
    }
  }

  if (!isIntercepted && callback) {
    cb(defaultRes);
  }
};

export const runWebRequestService = (window: AppWindow) => {
  const webviewRequest = session.fromPartition('persist:view').webRequest;

  // onBeforeSendHeaders

  const onBeforeSendHeaders = async (details: any, callback: any) => {
    const requestHeaders = objectToArray(details.requestHeaders);

    const newDetails: any = {
      ...getDetails(details, window, true),
      requestHeaders,
    };

    interceptRequest('onBeforeSendHeaders', newDetails, callback);
  };

  webviewRequest.onBeforeSendHeaders(async (details: any, callback: any) => {
    details.requestHeaders['User-Agent'] = USER_AGENT;
    details.requestHeaders['DNT'] = '1';

    await onBeforeSendHeaders(details, callback);
  });

  // onBeforeRequest

  const onBeforeRequest = async (details: any, callback: any) => {
    const newDetails: any = getDetails(details, window, true);
    interceptRequest('onBeforeRequest', newDetails, callback);
  };

  webviewRequest.onBeforeRequest(
    async (details: Electron.OnBeforeRequestDetails, callback: any) => {
      const tabId = getTabByWebContentsId(window, details.webContentsId);

      if (engine) {
        const { match, redirect } = engine.match(
          makeRequest({ type: details.resourceType, url: details.url }, parse),
        );

        if (match || redirect) {
          appWindow.webContents.send(`blocked-ad-${tabId}`);

          if (redirect) {
            callback({ redirectURL: redirect });
          } else {
            callback({ cancel: true });
          }

          return;
        }
      }

      await onBeforeRequest(details, callback);
    },
  );

  // onHeadersReceived

  const onHeadersReceived = async (details: any, callback: any) => {
    const responseHeaders = objectToArray(details.responseHeaders);

    const newDetails: any = {
      ...getDetails(details, window, true),
      responseHeaders,
    };

    interceptRequest('onHeadersReceived', newDetails, callback);
  };

  webviewRequest.onHeadersReceived(
    async (details: Electron.OnHeadersReceivedDetails, callback: any) => {
      updateResponseHeadersWithCSP(
        {
          url: details.url,
          type: details.resourceType as any,
          tabId: getTabByWebContentsId(window, details.webContentsId),
          method: details.method,
          statusCode: details.statusCode,
          statusLine: details.statusLine,
          requestId: details.id.toString(),
          frameId: 0,
          parentFrameId: -1,
          timeStamp: details.timestamp,
        },
        engine.getCSPDirectives(
          makeRequest(
            {
              sourceUrl: details.url,
              type: details.resourceType,
              url: details.url,
            },
            parse,
          ),
        ),
      ),
        await onHeadersReceived(details, callback);
    },
  );

  // onSendHeaders

  const onSendHeaders = async (details: any) => {
    const requestHeaders = objectToArray(details.requestHeaders);
    const newDetails: any = {
      ...getDetails(details, window, true),
      requestHeaders,
    };

    interceptRequest('onSendHeaders', newDetails);
  };

  webviewRequest.onSendHeaders(async (details: any) => {
    await onSendHeaders(details);
  });

  // onCompleted

  const onCompleted = async (details: any) => {
    const newDetails: any = getDetails(details, window, true);
    interceptRequest('onCompleted', newDetails);
  };

  webviewRequest.onCompleted(async (details: any) => {
    await onCompleted(details);
  });

  // onErrorOccurred

  const onErrorOccurred = async (details: any) => {
    const newDetails: any = getDetails(details, window, true);
    interceptRequest('onErrorOccurred', newDetails);
  };

  webviewRequest.onErrorOccurred(async (details: any) => {
    await onErrorOccurred(details);
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
