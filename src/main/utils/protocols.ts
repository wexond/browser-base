import { app, protocol } from 'electron';
import { readFile } from 'fs';
import { join } from 'path';
import { parse } from 'url';

import { Global } from '../interfaces';

declare const global: Global;

export const registerProtocols = () => {
  protocol.registerStandardSchemes(['wexond']);

  (app as any).on('session-created', (sess: Electron.session) => {
    sess.protocol.registerBufferProtocol(
      'wexond-extension',
      (request, callback) => {
        const parsed = parse(request.url);

        if (!parsed.hostname || !parsed.path) {
          return callback();
        }

        const manifest = global.extensions[parsed.hostname];

        if (!manifest) {
          return callback();
        }

        const page = global.backgroundPages[parsed.hostname];

        if (page && parsed.path === `/${page.name}`) {
          return callback({
            mimeType: 'text/html',
            data: page.html,
          });
        }

        readFile(
          join(manifest.srcDirectory, parsed.path.split('%3F')[0]),
          (err, content) => {
            if (err) {
              return (callback as any)(-6); // FILE_NOT_FOUND
            }
            return callback(content);
          },
        );

        return null;
      },
      error => {
        if (error) {
          console.error(
            `Failed to register wexond-extension protocol: ${error}`,
          );
        }
      },
    );
    sess.protocol.registerFileProtocol(
      'wexond',
      (request, callback: any) => {
        const parsed = parse(request.url);

        if (parsed.hostname === 'build' && parsed.path) {
          return callback({ path: join(__dirname, 'build', parsed.path) });
        }

        if (parsed.hostname === 'newtab') {
          if (parsed.path === '/') {
            return callback({
              path: join(__dirname, 'static/pages', parsed.hostname + '.html'),
            });
          }

          return callback({
            path: join(__dirname, 'static/pages', parsed.path),
          });
        }
      },
      error => {
        if (error) console.error('Failed to register protocol');
      },
    );
  });
};
