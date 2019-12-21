import { ipcMain, nativeTheme, dialog } from 'electron';

import { DEFAULT_SETTINGS } from '~/constants';

import { promises } from 'fs';

import { getPath, makeId } from '~/utils';
import { EventEmitter } from 'events';
import { runAdblockService, stopAdblockService } from '../services/adblock';
import { WindowsManager } from '../windows-manager';
import { WEBUI_BASE_URL } from '~/constants/files';

export class Settings extends EventEmitter {
  public object = DEFAULT_SETTINGS;

  private queue: string[] = [];

  private loaded = false;

  private windowsManager: WindowsManager;

  public constructor(windowsManager: WindowsManager) {
    super();

    this.windowsManager = windowsManager;

    ipcMain.on(
      'save-settings',
      (e, { settings }: { settings: string; incognito: boolean }) => {
        this.object = { ...this.object, ...JSON.parse(settings) };

        this.addToQueue();
      },
    );

    ipcMain.on('get-settings-sync', async e => {
      await this.onLoad();
      this.update();
      e.returnValue = this.object;
    });

    ipcMain.on('get-settings', async e => {
      await this.onLoad();
      this.update();
      e.sender.send('update-settings', this.object);
    });

    ipcMain.on('downloads-path-change', async () => {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        defaultPath: this.object.downloadsPath,
        properties: ['openDirectory'],
      });

      if (canceled) return;

      this.object.downloadsPath = filePaths[0];

      this.addToQueue();
    });

    nativeTheme.on('updated', () => {
      this.update();
    });

    this.load();
  }

  private onLoad = async (): Promise<void> => {
    return new Promise(resolve => {
      if (!this.loaded) {
        this.once('load', () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  };

  public update = () => {
    const contexts = [
      this.windowsManager.sessionsManager.extensions,
      this.windowsManager.sessionsManager.extensionsIncognito,
    ];

    if (this.object.themeAuto) {
      this.object.theme = nativeTheme.shouldUseDarkColors
        ? 'wexond-dark'
        : 'wexond-light';
    }

    for (const window of this.windowsManager.list) {
      window.webContents.send('update-settings', this.object);
      window.searchDialog.webContents.send('update-settings', this.object);
      window.menuDialog.webContents.send('update-settings', this.object);
      window.previewDialog.webContents.send('update-settings', this.object);
      window.tabGroupDialog.webContents.send('update-settings', this.object);
      window.downloadsDialog.webContents.send('update-settings', this.object);
      window.addBookmarkDialog.webContents.send('update-settings', this.object);

      window.viewManager.views.forEach(v => {
        if (v.webContents.getURL().startsWith(WEBUI_BASE_URL)) {
          v.webContents.send('update-settings', this.object);
        }
      });
    }

    contexts.forEach(e => {
      if (e.extensions['wexond-darkreader']) {
        e.extensions['wexond-darkreader'].backgroundPage.webContents.send(
          'api-runtime-sendMessage',
          {
            message: {
              name: 'toggle',
              toggle: this.object.darkContents,
            },
          },
        );
      }

      if (this.object.shield) {
        // runAdblockService(e.session);
      } else {
        // stopAdblockService(e.session);
      }
    });
  };

  private async load() {
    try {
      const file = await promises.readFile(getPath('settings.json'), 'utf8');
      const json = JSON.parse(file);

      if (!json.version) {
        // Migrate from 3.0.0 to 3.1.0
        json.searchEngines = [];
      }

      if (json.themeAuto === undefined) {
        json.themeAuto = true;
      }

      if (json.overlayBookmarks !== undefined) {
        delete json.overlayBookmarks;
      }

      if (json.darkTheme !== undefined) {
        delete json.darkTheme;
      }

      this.object = {
        ...this.object,
        ...json,
      };

      this.loaded = true;

      this.addToQueue();
      this.emit('load');
    } catch (e) {
      this.loaded = true;
      this.emit('load');
    }

    this.update();
  }

  private async save() {
    try {
      await promises.writeFile(
        getPath('settings.json'),
        JSON.stringify(this.object),
      );

      if (this.queue.length >= 3) {
        for (let i = this.queue.length - 1; i > 0; i--) {
          this.removeAllListeners(this.queue[i]);
          this.queue.splice(i, 1);
        }
      } else {
        this.queue.splice(0, 1);
      }

      if (this.queue[0]) {
        this.emit(this.queue[0]);
      }
    } catch (e) {
      console.error(e);
    }
  }

  public async addToQueue() {
    const id = makeId(32);

    this.queue.push(id);

    this.update();

    if (this.queue.length === 1) {
      this.save();
    } else {
      this.once(id, () => {
        this.save();
      });
    }
  }
}
