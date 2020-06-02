/* eslint @typescript-eslint/camelcase: 0 */

import { observable, computed } from 'mobx';
import store from './';
import { IBrowserAction } from '~/common/extensions/interfaces/browser-action';

const findClosestIconSize = (array: number[], target: number) => {
  let selected: number;
  let lowest: number;

  array.forEach((r) => {
    const res = target - r;

    if (lowest == null || lowest > res) {
      lowest = res;
      selected = r;
    }
  });

  return selected;
};

export class ExtensionsStore {
  @observable
  private _browserActions: IBrowserAction[] = [];

  @computed
  public get browserActions(): IBrowserAction[] {
    return this._browserActions.map((x) => {
      let icon = x.icon;

      if (typeof x.icon === 'object') {
        const size = findClosestIconSize(
          Object.keys(x.icon).map((y) => parseInt(y)),
          32,
        );

        icon = x.icon[size];
      }

      return {
        ...x,
        icon,
      };
    });
  }

  public set browserActions(value: IBrowserAction[]) {
    this._browserActions = value;
  }

  @observable
  public currentlyToggledPopup = '';

  constructor() {
    // TODO: idl
    // browser.browserAction.onUpdated.addListener((newAction: IBrowserAction) => {
    //   this.browserActions = this.browserActions.map((x) => {
    //     if (
    //       x.extensionId === newAction.extensionId &&
    //       ((x.tabId && x.tabId === store.tabs.selectedTabId) || !x.tabId)
    //     ) {
    //       return newAction;
    //     }
    //     return x;
    //   });
    // });
  }
}
