import { Session } from 'electron';
import { existsSync, readFile, writeFile, mkdirSync } from 'fs';
import { resolve } from 'path';
import { appWindow, settings } from '..';
import Axios from 'axios';

import {
  FiltersEngine,
  makeRequest,
  updateResponseHeadersWithCSP,
} from '@cliqz/adblocker';
import { parse } from 'tldts';
import { getPath } from '~/shared/utils/paths';

const lists: any = {
  easylist: 'https://easylist.to/easylist/easylist.txt',
  easyprivacy: 'https://easylist.to/easylist/easyprivacy.txt',
  malwaredomains: 'http://mirror1.malwaredomains.com/files/justdomains',
  nocoin:
    'https://raw.githubusercontent.com/hoshsadiq/adblock-nocoin-list/master/nocoin.txt',
  'ublock-filters':
    'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt',
  'ublock-badware':
    'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/badware.txt',
  'ublock-privacy':
    'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/privacy.txt',
  'ublock-unbreak':
    'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/unbreak.txt',
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

export let engine: FiltersEngine;

const loadFilters = async () => {
  if (!existsSync(getPath('adblock'))) {
    mkdirSync(getPath('adblock'));
  }

  const path = resolve(getPath('adblock/cache.dat'));

  const downloadFilters = () => {
    const ops = [];

    for (const key in lists) {
      ops.push(Axios.get(lists[key]));
    }

    Axios.all(ops).then(res => {
      let data = '';

      for (const res1 of res) {
        data += res1.data;
      }

      engine = FiltersEngine.parse(data);

      writeFile(path, engine.serialize(), err => {
        if (err) return console.error(err);
      });
    });
  };

  if (existsSync(path)) {
    readFile(resolve(path), (err, buffer) => {
      if (err) return console.error(err);

      try {
        engine = FiltersEngine.deserialize(buffer);
      } catch (e) {
        downloadFilters();
      }

      /*const { networkFilters, cosmeticFilters } = parseFilters(
        data,
        engine.config,
      );

      engine.update({
        newNetworkFilters: networkFilters,
        newCosmeticFilters: cosmeticFilters,
      });*/
    });
  } else {
    downloadFilters();
  }
};

export const runAdblockService = (ses: Session) => {
  const { webRequest } = ses;

  loadFilters();

  webRequest.onBeforeRequest(
    { urls: ['<all_urls>'] },
    async (details: Electron.OnBeforeRequestDetails, callback: any) => {
      if (engine && settings.isShieldToggled) {
        const { match, redirect } = engine.match(
          makeRequest({ type: details.resourceType, url: details.url }, parse),
        );

        if (match || redirect) {
          appWindow.webContents.send(`blocked-ad-${details.webContentsId}`);

          if (redirect) {
            callback({ redirectURL: redirect });
          } else {
            callback({ cancel: true });
          }

          return;
        }
      }

      callback({ cancel: false });
    },
  );

  webRequest.onHeadersReceived(
    { urls: ['<all_urls>'] },
    async (details: Electron.OnHeadersReceivedDetails, callback: any) => {
      const responseHeaders = objectToArray(
        updateResponseHeadersWithCSP(
          {
            url: details.url,
            type: details.resourceType as any,
            tabId: details.webContentsId,
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
      );

      callback({ cancel: false, responseHeaders });
    },
  );
};
