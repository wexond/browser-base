import { ipcMain } from 'electron';

import { ISettings } from '~/interfaces';
import { DEFAULT_SETTINGS } from '~/constants';

export let settings: ISettings = DEFAULT_SETTINGS;

ipcMain.on('settings', (e: any, s: ISettings) => {
  settings = { ...settings, ...s };
  settingsQueue.addToQueue();
});

import { promises } from 'fs';

import { getPath, makeId } from '~/utils';
import { EventEmitter } from 'events';

const settingsQueue = new (class SettingsQueue extends EventEmitter {
  private queue: any[] = [];

  private async save() {
    try {
      await promises.writeFile(
        getPath('settings.json'),
        JSON.stringify(settings),
      );
      if (this.queue.length >= 3) {
        for (let i = 0; i < this.queue.length - 2; i++) {
          this.removeAllListeners(this.queue[i]);
        }

        this.queue = this.queue.slice(0, this.queue.length - 2);
      } else {
        this.queue.splice(0, 1);
      }

      this.emit(this.queue[0]);
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
})();
