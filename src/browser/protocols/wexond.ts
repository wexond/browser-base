import { join, resolve } from 'path';
import { parse } from 'url';
import { protocol } from 'electron';
import { promises } from 'fs';
import { fromBuffer } from 'file-type';
import { lookup } from 'mime-types';

import { Application } from '../application';
import { ICON_PAGE } from '~/renderer/constants';

export default {
  register: (session: Electron.Session) => {
    session.protocol.registerBufferProtocol(
      'wexond',
      async (request, callback) => {
        const parsed = parse(request.url);

        let buffer: Buffer;
        let mimeType: string;

        if (parsed.hostname === 'favicon') {
          const favicon = Buffer.from(
            await Application.instance.storage.favicons.getFavicon(
              parsed.path.substr(1),
            ),
          );

          if (favicon) {
            buffer = favicon;
            mimeType = 'image/png';
          } else {
            const imgPath = resolve('build', ICON_PAGE);

            buffer = await promises.readFile(imgPath);
            mimeType = 'image/svg+xml';
          }
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
