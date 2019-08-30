import { ipcMain } from 'electron';

import { DEFAULT_SETTINGS } from '~/constants';

import { promises } from 'fs';

import { getPath, makeId } from '~/utils';
import { EventEmitter } from 'events';
import { windowsManager } from '..';

export class Settings extends EventEmitter {
  public object = DEFAULT_SETTINGS;

  private queue: string[] = [];

  private loaded = false;

  public constructor() {
    super();

    ipcMain.on(
      'save-settings',
      (e, { settings }: { settings: string; incognito: boolean }) => {
        this.object = { ...this.object, ...JSON.parse(settings) };

        for (const window of windowsManager.list) {
          if (window.webContents.id !== e.sender.id) {
            window.webContents.send('update-settings', this.object);
          }
        }

        this.updateDarkReader();

        this.addToQueue();
      },
    );

    ipcMain.on('get-settings-sync', e => {
      if (!this.loaded) {
        this.once('load', () => {
          this.updateDarkReader();
          e.returnValue = this.object;
        });
      } else {
        this.updateDarkReader();
        e.returnValue = this.object;
      }
    });

    ipcMain.on('get-settings', e => {
      if (!this.loaded) {
        this.once('load', () => {
          this.updateDarkReader();
          e.sender.send('get-settings', this.object);
        });
      } else {
        this.updateDarkReader();
        e.sender.send('get-settings', this.object);
      }
    });

    this.load();
  }

  private updateDarkReader = () => {
    const contexts = [
      windowsManager.sessionsManager.extensionsIncognito,
      windowsManager.sessionsManager.extensions,
    ];

    contexts.forEach(e => {
      if (e.extensions['wexond-darkreader']) {
        e.extensions['wexond-darkreader'].backgroundPage.webContents.send(
          'api-runtime-sendMessage',
          {
            message: {
              name: 'toggle',
              toggle: this.object.darkTheme,
            },
          },
        );
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

      this.object = {
        ...this.object,
        ...json,
      };

      this.loaded = true;

      this.save();

      this.emit('load');
    } catch (e) {
      this.loaded = true;
      this.emit('load');
    }
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

    if (this.queue.length === 1) {
      this.save();
    } else {
      this.once(id, () => {
        this.save();
      });
    }
  }
}
