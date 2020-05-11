/* eslint @typescript-eslint/camelcase: 0 */

import { observable, computed } from 'mobx';

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
  private _browserActions: any[] = [];

  @computed
  public get browserActions(): any[] {
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

  public set browserActions(value: any[]) {
    this._browserActions = value;
  }

  @observable
  public currentlyToggledPopup = '';

  constructor() {
    browser.browserAction.onUpdated.addListener((newAction: any) => {
      this.browserActions = this.browserActions.map((x) => {
        if (x.extensionId === newAction.extensionId) {
          return newAction;
        }
        return x;
      });
    });
  }
}
