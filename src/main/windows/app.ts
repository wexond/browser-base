import { BrowserWindow, app, dialog } from 'electron';
import { writeFileSync, promises } from 'fs';
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
  TabGroupDialog,
  DownloadsDialog,
  AddBookmarkDialog,
} from '../dialogs';
import { ISettings } from '~/interfaces';

export class AppWindow extends BrowserWindow {
  public viewManager: ViewManager;

  public searchDialog = new SearchDialog(this);
  public previewDialog = new PreviewDialog(this);

  public tabGroupDialog: TabGroupDialog;
  public menuDialog: MenuDialog;
  public findDialog: FindDialog;
  public downloadsDialog: DownloadsDialog;
  public addBookmarkDialog: AddBookmarkDialog;

  public permissionsDialog: PermissionsDialog;
  public authDialog: AuthDialog;
  public formFillDialog: FormFillDialog;
  public credentialsDialog: CredentialsDialog;

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
      backgroundColor: '#ffffff',
      webPreferences: {
        plugins: true,
        nodeIntegration: true,
        contextIsolation: false,
        javascript: true,
      },
      icon: resolve(app.getAppPath(), 'static/app-icons/icon.png'),
      show: false,
    });

    this.incognito = incognito;
    this.windowsManager = windowsManager;

    this.webContents.once('dom-ready', () => {
      this.tabGroupDialog = new TabGroupDialog(this);
      this.menuDialog = new MenuDialog(this);
      this.findDialog = new FindDialog(this);
      this.downloadsDialog = new DownloadsDialog(this);
      this.addBookmarkDialog = new AddBookmarkDialog(this);

      this.permissionsDialog = new PermissionsDialog(this);
      this.authDialog = new AuthDialog(this);
      this.formFillDialog = new FormFillDialog(this);
      this.credentialsDialog = new CredentialsDialog(this);
    });

    this.viewManager = new ViewManager(this, incognito);

    runMessagingService(this);

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
    })();

    this.show();

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
      this.tabGroupDialog.rearrange();
      this.downloadsDialog.rearrange();
      this.addBookmarkDialog.rearrange();
    });

    this.on('move', () => {
      if (!this.isMaximized()) {
        windowState.bounds = this.getBounds();
      }
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

    this.on('close', (event: Electron.Event) => {
      const { object: settings } = this.windowsManager.settings;

      if (settings.warnOnQuit && this.viewManager.views.size > 1) {
        const answer = dialog.showMessageBoxSync(null, {
          type: 'question',
          title: `Quit ${app.name}?`,
          message: `Quit ${app.name}?`,
          detail: `You have opened ${this.viewManager.views.size} tabs.`,
          buttons: ['Close', 'Cancel'],
        });

        if (answer === 1) {
          event.preventDefault();
          return;
        }
      }

      // Save current window state to a file.
      windowState.maximized = this.isMaximized();
      windowState.fullscreen = this.isFullScreen();
      writeFileSync(windowDataPath, JSON.stringify(windowState));

      this.setBrowserView(null);

      // TODO: make a cleaner way to destroy dialogs
      this.menuDialog.destroy();
      this.searchDialog.destroy();
      this.authDialog.destroy();
      this.findDialog.destroy();
      this.formFillDialog.destroy();
      this.credentialsDialog.destroy();
      this.permissionsDialog.destroy();
      this.previewDialog.destroy();
      this.tabGroupDialog.destroy();
      this.downloadsDialog.destroy();
      this.addBookmarkDialog.destroy();

      this.menuDialog = null;
      this.searchDialog = null;
      this.authDialog = null;
      this.findDialog = null;
      this.formFillDialog = null;
      this.credentialsDialog = null;
      this.permissionsDialog = null;
      this.previewDialog = null;
      this.tabGroupDialog = null;
      this.downloadsDialog = null;
      this.addBookmarkDialog = null;

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

    if (process.env.NODE_ENV === 'development') {
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

  public fixDragging() {
    if (process.platform === 'darwin') {
      const bounds = this.getBounds();
      this.setBounds({
        height: bounds.height + 1,
      });
      this.setBounds(bounds);
    }
  }
}
