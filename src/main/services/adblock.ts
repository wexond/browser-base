import { Session } from 'electron';
import { existsSync, readFile, writeFile, mkdirSync } from 'fs';
import { resolve } from 'path';
import { settings, windowsManager } from '..';
import Axios from 'axios';

import { FiltersEngine, Request } from '@cliqz/adblocker';
import { getPath } from '~/utils';

const lists: any = {
  easylist: 'https://easylist.to/easylist/easylist.txt',
  easyprivacy: 'https://easylist.to/easylist/easyprivacy.txt',

  'plowe-0':
    'https://pgl.yoyo.org/adservers/serverlist.php?hostformat=adblockplus&showintro=0&mimetype=plaintext',

  'ublock-filters':
    'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt',
  'ublock-badware':
    'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/badware.txt',
  'ublock-privacy':
    'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/privacy.txt',
  'ublock-unbreak':
    'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/unbreak.txt',
  'ublock-abuse':
    'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/resource-abuse.txt',
};

export let engine: FiltersEngine;

const loadFilters = async () => {
  const path = resolve(getPath('adblock/cache.dat'));

  const downloadFilters = () => {
    const ops = [];

    for (const key in lists) {
      ops.push(Axios.get(lists[key]));
    }

    Axios.all(ops).then(async res => {
      let data = '';

      for (const res1 of res) {
        data += res1.data;
      }

      engine = FiltersEngine.parse(data);

      const resources = (await Axios.get(
        'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/resources.txt',
      )).data;

      engine.updateResources(resources, `${resources.length}`);

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
      if (engine && settings.shield) {
        const { match, redirect } = engine.match(
          Request.fromRawDetails({
            type: details.resourceType as any,
            url: details.url,
          }),
        );

        if (match || redirect) {
          setTimeout(() =>
            windowsManager
              .findWindowByBrowserView(details.webContentsId)
              .webContents.send(`blocked-ad-${details.webContentsId}`),
          );

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
};
