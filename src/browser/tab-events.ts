import { Tab } from './tab';
import { Application } from './application';
import { extensions } from './extensions';

export const hookTabEvents = (tab: Tab) => {};

export const hookTabEvents1 = (tab: Tab) => {
  tab.webContents.on('context-menu', (e, params) => {
    const menu = getViewMenu(this.window, params, this.webContents);
    menu.popup();
  });

  this.webContents.addListener('found-in-page', (e, result) => {
    Application.instance.dialogs
      .getDynamic('find')
      .browserView.webContents.send('found-in-page', result);
  });

  this.webContents.addListener('page-title-updated', (e, title) => {
    this.window.updateTitle();
    this.updateData();

    this.emitEvent('title-updated', title);
  });

  this.webContents.addListener('did-navigate', async (e, url) => {
    this.emitEvent('did-navigate', url);

    await this.addHistoryItem(url);
    this.updateURL(url);
  });

  this.webContents.addListener(
    'did-navigate-in-page',
    async (e, url, isMainFrame) => {
      if (isMainFrame) {
        this.emitEvent('did-navigate', url);

        await this.addHistoryItem(url, true);
        this.updateURL(url);
      }
    },
  );

  this.webContents.addListener('did-stop-loading', () => {
    this.updateNavigationState();
    this.emitEvent('loading', false);
  });

  this.webContents.addListener('did-start-loading', () => {
    this.updateNavigationState();
    this.emitEvent('loading', true);
  });

  this.webContents.addListener('did-start-navigation', async (e, ...args) => {
    this.updateNavigationState();

    this.favicon = '';

    this.emitEvent('load-commit', ...args);
  });

  this.webContents.addListener(
    'new-window',
    (e, url, frameName, disposition) => {
      if (disposition === 'new-window') {
        if (frameName === '_self') {
          e.preventDefault();
          this.window.viewManager.selected.webContents.loadURL(url);
        } else if (frameName === '_blank') {
          e.preventDefault();
          this.window.viewManager.create(
            {
              url,
              active: true,
            },
            true,
          );
        }
      } else if (disposition === 'foreground-tab') {
        e.preventDefault();
        this.window.viewManager.create({ url, active: true }, true);
      } else if (disposition === 'background-tab') {
        e.preventDefault();
        this.window.viewManager.create({ url, active: false }, true);
      }
    },
  );

  this.webContents.addListener(
    'did-fail-load',
    (e, errorCode, errorDescription, validatedURL, isMainFrame) => {
      //ignore -3 (ABORTED) - An operation was aborted (due to user action).
      if (isMainFrame && errorCode !== -3) {
        this.errorURL = validatedURL;

        this.webContents.loadURL(`wexond-error://network-error/${errorCode}`);
      }
    },
  );

  this.webContents.addListener('page-favicon-updated', async (e, favicons) => {
    this.favicon = favicons[0];

    this.updateData();

    try {
      let fav = this.favicon;

      if (fav.startsWith('http')) {
        fav = await Application.instance.storage.addFavicon(fav);
      }

      this.emitEvent('favicon-updated', fav);
    } catch (e) {
      this.favicon = '';
      console.error(e);
    }
  });

  this.webContents.addListener('zoom-changed', (e, zoomDirection) => {
    const newZoomFactor =
      this.webContents.zoomFactor +
      (zoomDirection === 'in' ? ZOOM_FACTOR_INCREMENT : -ZOOM_FACTOR_INCREMENT);

    if (newZoomFactor <= ZOOM_FACTOR_MAX && newZoomFactor >= ZOOM_FACTOR_MIN) {
      this.webContents.zoomFactor = newZoomFactor;
      this.emitEvent('zoom-updated', this.webContents.zoomFactor);
      window.viewManager.emitZoomUpdate();
    } else {
      e.preventDefault();
    }
  });

  this.webContents.addListener(
    'certificate-error',
    (
      event: Electron.Event,
      url: string,
      error: string,
      certificate: Electron.Certificate,
      callback: Function,
    ) => {
      console.log(certificate, error, url);
      // TODO: properly handle insecure websites.
      event.preventDefault();
      callback(true);
    },
  );

  this.webContents.addListener('media-started-playing', () => {
    this.emitEvent('media-playing', true);
  });

  this.webContents.addListener('media-paused', () => {
    this.emitEvent('media-paused', true);
  });
};
