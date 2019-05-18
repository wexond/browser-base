import { app, protocol } from 'electron';
import { readFile } from 'fs';
import { join } from 'path';
import { parse } from 'url';

const applets = ['newtab'];

export const registerProtocols = () => {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'wexond',
      privileges: { bypassCSP: true, secure: true },
    },
  ]);

  (app as any).on('session-created', (sess: Electron.session) => {
    sess.protocol.registerFileProtocol(
      'wexond',
      (request, callback: any) => {
        const parsed = parse(request.url);

        if (applets.indexOf(parsed.hostname) !== -1) {
          if (parsed.path === '/') {
            return callback({
              path: join(app.getAppPath(), 'build', 'applets.html'),
            });
          }

          return callback({
            path: join(app.getAppPath(), 'build', parsed.path),
          });
        }

        if (parsed.path === '/') {
          return callback({
            path: join(
              app.getAppPath(),
              'static/pages',
              `${parsed.hostname}.html`,
            ),
          });
        }

        return callback({
          path: join(app.getAppPath(), 'static/pages', parsed.path),
        });
      },
      error => {
        if (error) console.error('Failed to register protocol');
      },
    );
  });
};
