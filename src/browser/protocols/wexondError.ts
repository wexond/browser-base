import { join } from 'path';
import { parse } from 'url';

export default {
  register: (session: Electron.Session) => {
    session.protocol.registerFileProtocol(
      'wexond-error',
      (request, callback: any) => {
        const parsed = parse(request.url);

        if (parsed.hostname === 'network-error') {
          return callback({
            path: join(__dirname, '../static/pages/', `network-error.html`),
          });
        }
      },
      (error) => {
        if (error) console.error(error);
      },
    );
  },
};
