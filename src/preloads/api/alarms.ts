import { API_ALARMS_OPERATION } from '@/constants/extensions';
import { makeId } from '@/utils/strings';
import { ipcRenderer } from 'electron';
import { IpcEvent } from '@/models/extensions';
import { Manifest } from '@/interfaces/extensions';

// https://developer.chrome.com/extensions/alarms
export const alarms = (manifest: Manifest) => {
  return {
    create: (name: string, alarmInfo: any) => {
      ipcRenderer.sendSync(API_ALARMS_OPERATION, {
        extensionId: manifest.extensionId,
        type: 'create',
        name,
        alarmInfo,
      });
    },
    get: (name: string, cb: any) => {},
    getAll: (cb: any) => {
      const id = makeId(32);

      ipcRenderer.send(API_ALARMS_OPERATION, {
        extensionId: manifest.extensionId,
        type: 'get-all',
        id,
      });

      if (cb) {
        ipcRenderer.once(
          API_ALARMS_OPERATION + id,
          (e: any, ...data: any[]) => {
            cb(...data);
          },
        );
      }
    },
    clear: (name: string, cb: any) => {},
    clearAll: (cb: any) => {},
    onAlarm: new IpcEvent('alarms', 'onAlarm'),
  };
};
