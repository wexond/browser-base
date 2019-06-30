import { observable, action } from 'mobx';
import { ipcRenderer, remote } from 'electron';
import { resolve } from 'path';
import { homedir } from 'os';
import store from '.';
import { getPath } from '~/utils/paths';
const json = require("edit-json-file");
const opts = json(getPath('settings.json'));

if(!opts.get("language")) {
  opts.set("language", "en");
  opts.save();
}

export class LocaleStore {

  public lang: any;

  @observable
  public currentLanguage: string = opts.get("language");

  @action
  public setLanguage(language: string, reload?: boolean) {
    this.currentLanguage = language;
    this.load()
    opts.set("language", language);
    opts.save();
    if(reload == true) {
        remote.webContents.getFocusedWebContents().reload()
    }
  }

  public load() {
    const languageJSON = json(`${remote.app.getAppPath()}/locale/${this.currentLanguage}.json`);
    this.lang = languageJSON.toObject()
  }

}