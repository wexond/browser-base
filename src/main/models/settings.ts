import { ipcMain } from 'electron';

import { DEFAULT_SETTINGS } from '~/constants';

import { promises } from 'fs';

import { getPath, makeId } from '~/utils';
import { EventEmitter } from 'events';
import { runAdblockService, stopAdblockService } from '../services/adblock';
import { WindowsManager } from '../windows-manager';

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

        for (const window of windowsManager.list) {
          if (window.webContents.id !== e.sender.id) {
            window.webContents.send('update-settings', this.object);
            window.searchDialog.webContents.send(
              'update-settings',
              this.object,
            );
            window.menuDialog.webContents.send('update-settings', this.object);
            window.previewDialog.webContents.send(
              'update-settings',
              this.object,
            );
            window.tabGroupDialog.webContents.send(
              'update-settings',
              this.object,
            );
            window.downloadsDialog.webContents.send(
              'update-settings',
              this.object,
            );
          }
        }

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
        runAdblockService(e.session);
      } else {
        stopAdblockService(e.session);
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
