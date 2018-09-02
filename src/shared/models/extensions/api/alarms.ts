import { API_ALARMS_OPERATION } from '@/constants/extensions';
import { makeId } from '@/utils/strings';
import { ipcRenderer } from 'electron';
import { IpcEvent } from '@/models/extensions';
import { Manifest } from '@/interfaces/extensions';
import { API } from '.';

let api: API;

// https://developer.chrome.com/extensions/alarms

export class Alarms {
  /**
   * Fired when an alarm has elapsed. Useful for event pages.
   *
   * @event
   * @type {Alarm} alarm
   */
  public onAlarm = new IpcEvent('alarms', 'onAlarm');

  // tslint:disable-next-line
  constructor(_api: API) {
    api = _api;
  }

  /**
   * Creates an alarm. Near the time(s) specified by `alarmInfo`,
   * the `onAlarm` event is fired. If there is another alarm with
   * the same name (or no name if none is specified),
   * it will be cancelled and replaced by this alarm.
   *
   * In order to reduce the load on the user's machine,
   * Chrome limits alarms to at most once every 1 minute but
   * may delay them an arbitrary amount more.
   * That is, setting `delayInMinutes` or `periodInMinutes` to less
   * than 1 will not be honored and will cause a warning.
   * `when` can be set to less than 1 minute after "now" without warning
   * but won't actually cause the alarm to fire for at least 1 minute.
   *
   * To help you debug your app or extension, when you've loaded it unpacked,
   * there's no limit to how often the alarm can fire.
   *
   * @param name
   * (optional) Optional name to identify this alarm. Defaults to the empty string.
   *
   * @param alarmInfo
   * Describes when the alarm should fire.
   * The initial time must be specified by either when or delayInMinutes (but not both).
   * If periodInMinutes is set, the alarm will repeat every periodInMinutes minutes
   * after the initial event. If neither when or delayInMinutes is set for a repeating alarm,
   * periodInMinutes is used as the default for delayInMinutes.
   */
  public create(
    name: string | chrome.alarms.AlarmCreateInfo,
    alarmInfo: chrome.alarms.AlarmCreateInfo,
  ) {
    ipcRenderer.sendSync(API_ALARMS_OPERATION, {
      extensionId: api.runtime.id,
      type: 'create',
      name,
      alarmInfo,
    });
  }

  /**
   * Retrieves details about the specified alarm.
   *
   * @param name (optional) The name of the alarm to get. Defaults to the empty string.
   *
   * @callback cb
   * @param {Alarm} alarm
   */
  public get(name: string, cb: any) {}

  /**
   * Gets an array of all the alarms.
   *
   * @callback cb
   * @param {Alarm[]} alarms
   */
  public getAll(cb: any) {
    const id = makeId(32);

    ipcRenderer.send(API_ALARMS_OPERATION, {
      extensionId: api.runtime.id,
      type: 'get-all',
      id,
    });

    if (cb) {
      ipcRenderer.once(API_ALARMS_OPERATION + id, (e: any, ...data: any[]) => {
        cb(...data);
      });
    }
  }

  /**
   * Clears the alarm with the given name.
   *
   * @param name (optional) The name of the alarm to clear. Defaults to the empty string.
   *
   * @callback cb (optional)
   * @param {boolean} wasDeclared
   */
  public clear(name: string, cb: any) {}

  /**
   * Clears all alarms.
   *
   * @callback cb (optional)
   * @param {boolean} wasDeclared
   */
  public clearAll(cb: any) {}
}
