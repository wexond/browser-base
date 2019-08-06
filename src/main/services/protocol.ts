import { protocol } from 'electron';
import { join } from 'path';
import { parse } from 'url';

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

export const registerProtocol = (session: Electron.Session) => {
  if (process.env.ENV === 'dev') {
    session.protocol.registerHttpProtocol(
      'wexond',
      (request, callback: any) => {
        const parsed = parse(request.url);

        const baseUrl = 'http://localhost:4444/';

        if (parsed.path === '/') {
          return callback({
            url: `${baseUrl}${parsed.hostname}.html`,
          });
        }

        callback({ url: `${baseUrl}${parsed.path}` });
      },
      error => {
        if (error) console.error(error);
      },
    );
  } else {
    session.protocol.registerFileProtocol(
      'wexond',
      (request, callback: any) => {
        const parsed = parse(request.url);

        const basePath = join(__dirname, 'build');

        if (parsed.path === '/') {
          return callback({
            path: join(basePath, `${parsed.hostname}.html`),
          });
        }

        callback({ path: join(basePath, parsed.path) });
      },
      error => {
        if (error) console.error(error);
      },
    );
  }
};
