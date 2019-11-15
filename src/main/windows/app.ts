import { BrowserWindow, app } from 'electron';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';

import { ViewManager } from '../view-manager';
import { getPath } from '~/utils';
import { runMessagingService } from '../services';
import { WindowsManager } from '../windows-manager';
import {
  MenuDialog,
  SearchDialog,
  FindDialog,
  PermissionsDialog,
  AuthDialog,
  FormFillDialog,
  CredentialsDialog,
  PreviewDialog,
} from '../dialogs';

export class AppWindow extends BrowserWindow {
  public viewManager: ViewManager;
  // public multrin = new Multrin(this);

  public menuDialog = new MenuDialog(this);
  public searchDialog = new SearchDialog(this);
  public findDialog = new FindDialog(this);
  public permissionsDialog = new PermissionsDialog(this);
  public authDialog = new AuthDialog(this);
  public formFillDialog = new FormFillDialog(this);
  public credentialsDialog = new CredentialsDialog(this);
  public previewDialog = new PreviewDialog(this);

  public incognito: boolean;

  private windowsManager: WindowsManager;

  public constructor(windowsManager: WindowsManager, incognito: boolean) {
    super({
      frame: false,
      minWidth: 400,
      minHeight: 450,
      width: 900,
      height: 700,
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        plugins: true,
        nodeIntegration: true,
        contextIsolation: false,
        javascript: true,
      },
      icon: resolve(app.getAppPath(), 'static/app-icons/icon.png'),
    });

    this.incognito = incognito;
    this.windowsManager = windowsManager;

    this.viewManager = new ViewManager(this, incognito);

    runMessagingService(this);

    const windowDataPath = getPath('window-data.json');

    let windowState: any = {};

    try {
      // Read the last window state from file.
      windowState = JSON.parse(readFileSync(windowDataPath, 'utf8'));
    } catch (e) {
      writeFileSync(windowDataPath, JSON.stringify({}));
    }

    // Merge bounds from the last window state to the current window options.
    if (windowState) {
      this.setBounds({ ...windowState.bounds });
    }

    if (windowState) {
      if (windowState.maximized) {
        this.maximize();
      }
      if (windowState.fullscreen) {
        this.setFullScreen(true);
      }
    }

    const moveAndResize = () => {};

    // Update window bounds on resize and on move when window is not maximized.
    this.on('resize', () => {
      if (!this.isMaximized()) {
        windowState.bounds = this.getBounds();
      }

      this.formFillDialog.rearrange();
      this.credentialsDialog.rearrange();
      this.authDialog.rearrange();
      this.findDialog.rearrange();
      this.menuDialog.hide();
      this.permissionsDialog.rearrange();
      this.searchDialog.rearrange();

      moveAndResize();
    });

    this.on('move', () => {
      if (!this.isMaximized()) {
        windowState.bounds = this.getBounds();
      }

      moveAndResize();
    });

    const resize = () => {
      setTimeout(() => {
        this.viewManager.fixBounds();
      });

      setTimeout(() => {
        this.webContents.send('tabs-resize');
      }, 500);

      this.webContents.send('tabs-resize');
    };

    this.on('maximize', resize);
    this.on('restore', resize);
    this.on('unmaximize', resize);

    this.on('close', () => {
      // Save current window state to a file.
      windowState.maximized = this.isMaximized();
      windowState.fullscreen = this.isFullScreen();
      writeFileSync(windowDataPath, JSON.stringify(windowState));

      this.menuDialog.destroy();
      this.searchDialog.destroy();
      this.authDialog.destroy();
      this.findDialog.destroy();
      this.formFillDialog.destroy();
      this.credentialsDialog.destroy();
      this.permissionsDialog.destroy();
      this.previewDialog.destroy();

      this.menuDialog = null;
      this.searchDialog = null;
      this.authDialog = null;
      this.findDialog = null;
      this.formFillDialog = null;
      this.credentialsDialog = null;
      this.permissionsDialog = null;
      this.previewDialog = null;

      this.viewManager.clear();

      if (
        incognito &&
        windowsManager.list.filter(x => x.incognito).length === 1
      ) {
        windowsManager.sessionsManager.clearCache('incognito');
        windowsManager.sessionsManager.unloadIncognitoExtensions();
      }

      windowsManager.list = windowsManager.list.filter(x => x.id !== this.id);
    });

    // this.webContents.openDevTools({ mode: 'detach' });

    if (process.env.ENV === 'dev') {
      this.webContents.openDevTools({ mode: 'detach' });
      this.loadURL('http://localhost:4444/app.html');
    } else {
      this.loadURL(join('file://', app.getAppPath(), 'build/app.html'));
    }

    this.on('enter-full-screen', () => {
      this.webContents.send('fullscreen', true);
      this.viewManager.fixBounds();
    });

    this.on('leave-full-screen', () => {
      this.webContents.send('fullscreen', false);
      this.viewManager.fixBounds();
    });

    this.on('enter-html-full-screen', () => {
      this.viewManager.fullscreen = true;
      this.webContents.send('html-fullscreen', true);
    });

    this.on('leave-html-full-screen', () => {
      this.viewManager.fullscreen = false;
      this.webContents.send('html-fullscreen', false);
    });

    this.on('scroll-touch-begin', () => {
      this.webContents.send('scroll-touch-begin');
    });

    this.on('scroll-touch-end', () => {
      this.viewManager.selected.webContents.send('scroll-touch-end');
      this.webContents.send('scroll-touch-end');
    });

    this.on('focus', () => {
      windowsManager.currentWindow = this;
    });
  }
}
