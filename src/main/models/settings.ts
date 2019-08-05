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

  constructor() {
    super();

    ipcMain.on('save-settings', (e, { settings, incognito }: any) => {
      this.object = { ...this.object, ...JSON.parse(settings) };

      for (const window of windowsManager.list) {
        if (window.webContents.id !== e.sender.id) {
          window.webContents.send('update-settings', this.object);
        }
      }

      const context = incognito
        ? windowsManager.sessionsManager.extensionsIncognito
        : windowsManager.sessionsManager.extensions;

      context.extensions['wexond-darkreader'].backgroundPage.webContents.send(
        'api-runtime-sendMessage',
        {
          message: {
            name: 'toggle',
            toggle: this.object.darkTheme,
          },
        },
      );

      this.addToQueue();
    });

    ipcMain.on('get-settings', e => {
      if (!this.loaded) {
        this.once('load', () => {
          e.returnValue = this.object;
        });
      } else {
        e.returnValue = this.object;
      }
    });

    this.load();
  }

  private async load() {
    try {
      const file = await promises.readFile(getPath('settings.json'), 'utf8');

      this.object = {
        ...this.object,
        ...JSON.parse(file),
      };

      this.loaded = true;

      this.emit('load');
    } catch (e) {
      console.error(e);
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
