import { sessionFromIpcEvent } from '../session';
import { HandlerFactory } from '../handler-factory';
import { sendToExtensionPages } from '../background-pages';

const ELECTRON_TO_CHROME_COOKIE_CHANGE_CAUSE: { [key: string]: string } = {
  explicit: 'explicit',
  overwrite: 'overwrite',
  expired: 'expired',
  evicted: 'evicted',
  'expired-overwrite': 'expired_overwrite',
};

export class CookiesAPI {
  constructor() {
    const handler = HandlerFactory.create('cookies', this);

    handler('get', this.get, true);
    handler('getAll', this.getAll, true);
    handler('set', this.set, true);
    handler('remove', this.remove, true);
  }

  public observeSession(ses: Electron.Session) {
    ses.cookies.on(
      'changed',
      (e: any, electronCookie: any, electronCause: any, removed: any) => {
        const cookie = this.getChromeCookie(electronCookie);
        const cause = ELECTRON_TO_CHROME_COOKIE_CHANGE_CAUSE[electronCause];

        const details = {
          cookie,
          cause,
          removed,
        };

        sendToExtensionPages('cookies.onChanged', details);
      },
    );
  }

  private getChromeCookie(cookie: Electron.Cookie): chrome.cookies.Cookie {
    return {
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      hostOnly: cookie.hostOnly,
      path: cookie.path,
      secure: cookie.secure,
      httpOnly: cookie.httpOnly,
      sameSite: 'no_restriction',
      session: cookie.session,
      expirationDate: cookie.expirationDate,
      storeId: '0',
    };
  }

  private async getAll(
    e: Electron.IpcMainEvent,
    details: chrome.cookies.Cookie & { url: string },
  ) {
    const { url, name, domain, path, secure, session } = details;

    const cookies = await sessionFromIpcEvent(e).cookies.get({
      url,
      name,
      domain,
      path,
      secure,
      session,
    });

    if (cookies) {
      return cookies.map((c) => this.getChromeCookie(c));
    }

    return [];
  }

  private async get(e: Electron.IpcMainEvent, details: chrome.cookies.Details) {
    const { url, name } = details;

    const cookies = await sessionFromIpcEvent(e).cookies.get({ url, name });

    if (cookies && cookies[0]) {
      const cookie = cookies[0];
      return this.getChromeCookie(cookie);
    }

    return null;
  }

  private async set(
    e: Electron.IpcMainEvent,
    details: { url: string } & Partial<chrome.cookies.Cookie>,
  ): Promise<Partial<chrome.cookies.Cookie>> {
    const {
      url,
      name,
      value,
      domain,
      path,
      secure,
      httpOnly,
      expirationDate,
    } = details;

    await sessionFromIpcEvent(e).cookies.set({
      url,
      name,
      value,
      domain,
      path,
      secure,
      httpOnly,
      expirationDate,
    });

    return {
      name,
      value,
      domain,
      path,
      secure,
      httpOnly,
      expirationDate,
      storeId: null,
    };
  }

  private async remove(
    e: Electron.IpcMainEvent,
    details: chrome.cookies.Details,
  ): Promise<Partial<chrome.cookies.Cookie & { url: string }>> {
    const { url, name } = details;

    await sessionFromIpcEvent(e).cookies.remove(url, name);
    return { url, name, storeId: null };
  }
}
