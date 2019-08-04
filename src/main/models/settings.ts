import { ipcMain } from 'electron';

import { ISettings } from '~/interfaces';
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

    ipcMain.on('save-settings', (e: any, s: string) => {
      this.object = { ...this.object, ...JSON.parse(s) };

      for (const window of windowsManager.list) {
        if (window.webContents.id !== e.sender.id) {
          window.webContents.send('get-settings', this.object);
        }
      }

      this.addToQueue();
    });

    ipcMain.on('get-settings', e => {
      if (!this.loaded) {
        this.once('load', () => {
          e.sender.send('get-settings', this.object);
        });
      } else {
        e.sender.send('get-settings', this.object);
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
