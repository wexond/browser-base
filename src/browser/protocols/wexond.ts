import { join } from 'path';
import { parse } from 'url';
import { protocol } from 'electron';
import { promises } from 'fs';
import { fromBuffer } from 'file-type';
import { lookup } from 'mime-types';

export default {
  register: (session: Electron.Session) => {
    session.protocol.registerBufferProtocol(
      'wexond',
      async (request, callback) => {
        const parsed = parse(request.url);

        let buffer: Buffer;
        let mimeType: string;

        if (parsed.hostname === 'favicon') {
          // TODO(xnerhu): get favicon buffer from db
          buffer = Buffer.from('test');
          mimeType = 'image/png';
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
