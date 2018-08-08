import { app } from 'electron';
import { readFile } from 'fs';
import { join } from 'path';
import { parse } from 'url';

import { Global } from './interfaces';

declare const global: Global;

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

      readFile(join(manifest.srcDirectory, parsed.path), (err, content) => {
        if (err) {
          return (callback as any)(-6); // FILE_NOT_FOUND
        }
        return callback(content);
      });

      return null;
    },
    error => {
      if (error) {
        console.error(`Failed to register wexond-extension protocol: ${error}`);
      }
    },
  );
});
