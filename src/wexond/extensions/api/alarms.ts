import { API } from '.';
import { IpcEvent } from '..';

let api: API;

// https://developer.chrome.com/extensions/alarms

export class Alarms {
  public onAlarm = new IpcEvent('alarms', 'onAlarm');

  constructor(_api: API) {
    api = _api;
  }

  public create = (
    name: string | chrome.alarms.AlarmCreateInfo,
    alarmInfo: chrome.alarms.AlarmCreateInfo,
  ) => {};

  public get = (name: string, cb: any) => {};

  public getAll = (cb: any) => {};

  public clear = (name: string, cb: any) => {};

  public clearAll = (cb: any) => {};
}
