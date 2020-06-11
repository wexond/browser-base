import { BrowserWindow, app, session } from 'electron';
import { writeFileSync, promises } from 'fs';
import { resolve } from 'path';

import { getPath } from '~/utils';
import { Application } from '../application';
import { isNightly } from '..';
import { getWebUIURL } from '~/common/utils/protocols';
import { BrowserContext } from '../browser-context';
import { OverlayWindow } from './overlay';

export class AppWindow {
  public win: BrowserWindow;

  public overlayWindow: OverlayWindow;

  public incognito: boolean;

  public selectedTabId = -1;

  public browserContext: BrowserContext;

  public constructor(browserContext: BrowserContext) {
    this.browserContext = browserContext;
    this.init();

    // TODO: sandbox
    // runMessagingService(this);

    // const resize = () => {
    //   TODO: sandbox
    //   setTimeout(() => {
    //     if (process.platform === 'linux') {
    //       this.viewManager.select(this.viewManager.selectedId, false);
    //     } else {
    //       this.viewManager.fixBounds();
    //     }
    //   });
    // };

    // this.win.on('close', (event: Electron.Event) => {
    //   const { object: settings } = Application.instance.settings;
    //   TODO: sandbox
    //   if (settings.warnOnQuit && this.viewManager.views.size > 1) {
    //     const answer = dialog.showMessageBoxSync(null, {
    //       type: 'question',
    //       title: `Quit ${app.name}?`,
    //       message: `Quit ${app.name}?`,
    //       detail: `You have opened ${this.viewManager.views.size} tabs.`,
    //       buttons: ['Close', 'Cancel'],
    //     });
    //     if (answer === 1) {
    //       event.preventDefault();
    //       return;
    //     }
    //   }
    //   Application.instance.dialogs.destroy();
    //   this.viewManager.clear();
    //   if (
    //     incognito &&
    //     Application.instance.windows.list.filter((x) => x.incognito).length ===
    //       1
    //   ) {
    //     Application.instance.sessions.clearCache('incognito');
    //     Application.instance.sessions.unloadIncognitoExtensions();
    //   }
    //   Application.instance.windows.list = Application.instance.windows.list.filter(
    //     (x) => x.win.id !== this.win.id,
    //   );
    // });

    // this.webContents.openDevTools({ mode: 'detach' });

    // TODO: sandbox
    // this.win.on('enter-full-screen', () => {
    //   this.send('fullscreen', true);
    //   this.viewManager.fixBounds();
    // });

    // this.win.on('leave-full-screen', () => {
    //   this.send('fullscreen', false);
    //   this.viewManager.fixBounds();
    // });

    // this.win.on('enter-html-full-screen', () => {
    //   this.viewManager.fullscreen = true;
    //   this.send('html-fullscreen', true);
    // });

    // this.win.on('leave-html-full-screen', () => {
    //   this.viewManager.fullscreen = false;
    //   this.send('html-fullscreen', false);
    // });

    // this.win.on('scroll-touch-begin', () => {
    //   this.send('scroll-touch-begin');
    // });

    // this.win.on('scroll-touch-end', () => {
    //   this.viewManager.selected.send('scroll-touch-end');
    //   this.send('scroll-touch-end');
    // });

    // this.win.on('focus', () => {
    //   Application.instance.windows.current = this;
    // });
  }

  public init() {
    const browserContext = BrowserContext.from(
      session.fromPartition('persist:ui'),
      true,
    );

    this.win = new BrowserWindow({
      frame: false,
      minWidth: 400,
      minHeight: 450,
      width: 900,
      height: 700,
      titleBarStyle: 'hiddenInset',
      backgroundColor: '#ffffff',
      webPreferences: {
        plugins: true,
        sandbox: true,
        nodeIntegration: false,
        contextIsolation: true,
        javascript: true,
        enableRemoteModule: false,
        session: browserContext.session,
      },
      icon: resolve(
        app.getAppPath(),
        `static/${isNightly ? 'nightly-icons' : 'icons'}/icon.png`,
      ),
      show: false,
    });

    this.overlayWindow = new OverlayWindow(this.win);

    const windowDataPath = getPath('window-data.json');

    let windowState: any = {};

    (async () => {
      try {
        // Read the last window state from file.
        windowState = JSON.parse(
          await promises.readFile(windowDataPath, 'utf8'),
        );
      } catch (e) {
        await promises.writeFile(windowDataPath, JSON.stringify({}));
      }

      // Merge bounds from the last window state to the current window options.
      if (windowState) {
        this.win.setBounds({ ...windowState.bounds });
      }

      if (windowState) {
        if (windowState.maximized) {
          this.win.maximize();
        }
        if (windowState.fullscreen) {
          this.win.setFullScreen(true);
        }
      }
    })();

    this.win.show();

    const onUpdateBounds = () => {
      if (!this.win.isMaximized()) {
        windowState.bounds = this.win.getBounds();
      }

      this.overlayWindow.win.setBounds(this.win.getContentBounds());
    };

    // Update window bounds on resize and on move when window is not maximized.
    this.win.on('resize', onUpdateBounds);

    this.win.on('move', onUpdateBounds);

    const onStateChange = () => {
      setTimeout(() => {
        this.webContents.send('tabs-resize');
      }, 500);

      this.webContents.send('tabs-resize');
    };

    this.win.on('maximize', onStateChange);
    this.win.on('restore', onStateChange);
    this.win.on('unmaximize', onStateChange);

    this.win.on('close', () => {
      // Save current window state to a file.
      windowState.maximized = this.win.isMaximized();
      windowState.fullscreen = this.win.isFullScreen();
      writeFileSync(windowDataPath, JSON.stringify(windowState));

      this.win.setBrowserView(null);
    });

    this.win.loadURL(getWebUIURL('app'));

    this.setBoundsListener();
  }

  public get id() {
    return this.win.id;
  }

  public get webContents() {
    return this.win.webContents;
  }

  public fixDragging() {
    const bounds = this.win.getBounds();
    this.win.setBounds({
      height: bounds.height + 1,
    });
    this.win.setBounds(bounds);
  }

  public send(channel: string, ...args: any[]) {
    this.webContents.send(channel, ...args);
  }

  public updateTitle() {
    // TODO: sandbox
    // const { title } = this.viewManager.selected;
    // this.win.setTitle(
    //   title.trim() === '' ? app.name : `${title} - ${app.name}`,
    // );
  }

  private setBoundsListener() {
    // resize the BrowserView's height when the toolbar height changes
    // ex: when the bookmarks bar appears
    this.win.webContents.on('ipc-message', (e, message) => {
      if (message === 'resize-height') {
        Application.instance.tabs.fixBounds(this.id);
      }
    });
  }
}
