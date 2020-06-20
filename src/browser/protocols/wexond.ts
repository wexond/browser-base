import { join, resolve } from 'path';
import { parse, UrlWithStringQuery } from 'url';
import { protocol } from 'electron';
import { promises } from 'fs';
import { fromBuffer } from 'file-type';
import { lookup } from 'mime-types';
import { parse as parseQuery } from 'querystring';

import { Application } from '../application';
import { ICON_PAGE } from '~/renderer/constants';

type FaviconUrlFormat = 'favicon' | 'favicon2';

const getQueryParameter = (param: string | string[]) =>
  Array.isArray(param) ? param[0] : param;

const parseFaviconUrl = (
  url: UrlWithStringQuery,
  urlFormat: FaviconUrlFormat,
): { pageUrl: string; iconUrl?: string } => {
  switch (urlFormat) {
    case 'favicon':
      return { pageUrl: url.path.substr(1) };
    case 'favicon2':
      const { pageUrl, iconUrl } = parseQuery(url.query);
      return {
        pageUrl: getQueryParameter(pageUrl),
        iconUrl: getQueryParameter(iconUrl),
      };
  }
};

const handleFavicon = async (
  url: UrlWithStringQuery,
  urlFormat: FaviconUrlFormat,
) => {
  const { pageUrl, iconUrl } = parseFaviconUrl(url, urlFormat);

  let favicon = pageUrl
    ? await Application.instance.storage.favicons.getFaviconForPageURL(pageUrl)
    : await Application.instance.storage.favicons.getFavicon(iconUrl);

  if (pageUrl && !favicon) {
    const url = await Application.instance.storage.favicons.getPageURLForHost(
      parse(pageUrl).hostname,
    );

    favicon = await Application.instance.storage.favicons.getFaviconForPageURL(
      url,
    );
  }

  if (favicon) {
    return { data: favicon, mimeType: 'image/png' };
  } else {
    return {
      data: await promises.readFile(resolve('build', ICON_PAGE)),
      mimeType: 'image/svg+xml',
    };
  }
};

export default {
  register: (session: Electron.Session) => {
    session.protocol.registerBufferProtocol(
      'wexond',
      async (request, callback) => {
        const parsed = parse(request.url);

        let buffer: Buffer;
        let mimeType: string;

        if (parsed.hostname === 'favicon' || parsed.hostname === 'favicon2') {
          return callback(await handleFavicon(parsed, parsed.hostname));
        } else {
          const path = join(
            __dirname,
            parsed.path === '/' ? `${parsed.hostname}.html` : parsed.path,
          );
          buffer = await promises.readFile(path);

          const mime = lookup(path);
          if (mime) mimeType = mime;
        }

        if (!mimeType) {
          mimeType = '';
          const type = await fromBuffer(buffer);
          if (type) {
            mimeType = type.mime;
          }
        }

        callback({
          data: buffer,
          mimeType,
        });
      },
      (error) => {
        if (error) console.error(error);
      },
    );
  },
  setPrivileged: () => {
    protocol.registerSchemesAsPrivileged([
      {
        scheme: 'wexond',
        privileges: {
          bypassCSP: true,
          secure: true,
          standard: true,
          supportFetchAPI: true,
          allowServiceWorkers: true,
          corsEnabled: false,
        },
      },
    ]);
  },
};
