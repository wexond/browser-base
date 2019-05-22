import { app, protocol } from 'electron';
import { readFile } from 'fs';
import { join } from 'path';
import { parse } from 'url';
import { extensions } from './extensions';

const applets = ['newtab'];

export const registerProtocols = () => {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'wexond',
      privileges: { bypassCSP: true, secure: true },
    },
    {
      scheme: 'wexond-extension',
      privileges: { bypassCSP: true, secure: true },
    },
  ]);

  (app as any).on('session-created', (sess: Electron.session) => {
    sess.protocol.registerBufferProtocol(
      'wexond-extension',
      (request, callback) => {
        const parsed = parse(decodeURIComponent(request.url));

        if (!parsed.hostname || !parsed.pathname) {
          return callback();
        }

        const extension = extensions[parsed.hostname];

        if (!extension) {
          return callback();
        }

        const { backgroundPage, path } = extension;

        if (
          backgroundPage &&
          parsed.pathname === `/${backgroundPage.fileName}`
        ) {
          return callback({
            mimeType: 'text/html',
            data: backgroundPage.html,
          });
        }

        readFile(join(path, parsed.pathname), (err, content) => {
          if (err) {
            return (callback as any)(-6); // FILE_NOT_FOUND
          }
          return callback(content);
        });

        return null;
      },
      error => {
        if (error) {
          console.error(`Failed to register extension protocol: ${error}`);
        }
      },
    );
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
