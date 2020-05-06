import { join } from 'path';
import { parse } from 'url';
import { protocol } from 'electron';

export default {
  register: (session: Electron.Session) => {
    session.protocol.registerFileProtocol(
      'wexond',
      (request, callback: any) => {
        const parsed = parse(request.url);

        if (parsed.path === '/') {
          return callback({
            path: join(__dirname, `${parsed.hostname}.html`),
          });
        }

        callback({ path: join(__dirname, parsed.path) });
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
