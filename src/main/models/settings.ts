import { ipcMain, nativeTheme, dialog } from 'electron';

import { DEFAULT_SETTINGS, DEFAULT_SEARCH_ENGINES } from '~/constants';

import { promises } from 'fs';

import { getPath, makeId } from '~/utils';
import { EventEmitter } from 'events';
import { runAdblockService, stopAdblockService } from '../services/adblock';
import { Application } from '../application';
import { WEBUI_BASE_URL } from '~/constants/files';
import { ISettings } from '~/interfaces';

export class Settings extends EventEmitter {
  public object = DEFAULT_SETTINGS;

  private queue: string[] = [];

  private loaded = false;

  public constructor() {
    super();

    ipcMain.on(
      'save-settings',
      (e, { settings }: { settings: string; incognito: boolean }) => {
        this.updateSettings(JSON.parse(settings));
      },
    );

    ipcMain.on('get-settings-sync', async (e) => {
      await this.onLoad();
      this.update();
      e.returnValue = this.object;
    });

    ipcMain.on('get-settings', async (e) => {
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
    return new Promise((resolve) => {
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
    let themeSource = 'system';

    if (this.object.themeAuto) {
      this.object.theme = nativeTheme.shouldUseDarkColors
        ? 'wexond-dark'
        : 'wexond-light';
    } else {
      themeSource = this.object.theme === 'wexond-dark' ? 'dark' : 'light';
    }

    if (themeSource !== nativeTheme.themeSource) {
      nativeTheme.themeSource = themeSource as any;
    }

    Application.instance.dialogs.sendToAll('update-settings', this.object);

    for (const window of Application.instance.windows.list) {
      window.send('update-settings', this.object);

      window.viewManager.views.forEach(async (v) => {
        if (v.webContents.getURL().startsWith(WEBUI_BASE_URL)) {
          v.webContents.send('update-settings', this.object);
        }
      });
    }

    const contexts = [
      Application.instance.sessions.view,
      Application.instance.sessions.viewIncognito,
    ];

    contexts.forEach((e) => {
      if (this.object.shield) {
        runAdblockService(e);
      } else {
        stopAdblockService(e);
      }
    });
  };

  private async load() {
    try {
      const file = await promises.readFile(getPath('settings.json'), 'utf8');
      const json = JSON.parse(file);

      if (typeof json.version === 'string') {
        // Migrate from 3.1.0
        Application.instance.storage.remove({
          scope: 'startupTabs',
          query: {},
          multi: true,
        });
      }

      if (typeof json.version === 'string' || json.version === 1) {
        json.searchEngines = DEFAULT_SEARCH_ENGINES;
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
        version: DEFAULT_SETTINGS.version,
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
        JSON.stringify({ ...this.object, version: DEFAULT_SETTINGS.version }),
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

  public updateSettings(settings: Partial<ISettings>) {
    this.object = { ...this.object, ...settings };

    this.addToQueue();
  }
}
