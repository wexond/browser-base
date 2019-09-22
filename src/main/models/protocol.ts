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

        const baseUrl = 'http://localhost:4445/';

        if (parsed.path === '/') {
          return callback({
            url: `${baseUrl}${parsed.hostname}.html`,
          });
        }

        if (parsed.path.indexOf('node_modules') !== -1) {
          callback({ url: parsed.path, method: 'GET' });
        } else {
          callback({ url: `${baseUrl}${parsed.path}`, method: 'GET' });
        }
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

        if (parsed.path === '/') {
          return callback({
            path: join(__dirname, `${parsed.hostname}.html`),
          });
        }

        callback({ path: join(__dirname, parsed.path) });
      },
      error => {
        if (error) console.error(error);
      },
    );
  }
};
