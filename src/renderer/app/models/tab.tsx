import app from '..';
import { ipcRenderer } from 'electron';
import { TABS_PADDING, TAB_ANIMATION_DURATION } from '../constants';
import { closeWindow } from '../utils';
import { createElement } from 'ui';

let id = 0;

export class Tab {
  public rootElement: any;
  public titleElement: HTMLElement;

  public tabGroupId = 0;
  public isClosing = false;
  public width = 0;
  public left = 0;
  public id = id++;

  constructor(active: boolean) {
    this.rootElement = (
      <div className="tab" onMouseDown={this.onMouseDown}>
        <div className="tab-content">
          <div ref={r => (this.titleElement = r)} className="tab-title">
            New tab
          </div>
        </div>
        <div
          className="tab-close"
          onClick={this.onCloseClick}
          onMouseDown={this.onCloseMouseDown}
        />
      </div>
    );

    app.tabs.container.appendChild(this.rootElement);

    ipcRenderer.send('browserview-create', this.id);

    if (active) {
      ipcRenderer.once(`browserview-created-${this.id}`, () => {
        ipcRenderer.send('browserview-select', this.id);
      });

      this.select();
    }
  }

  public onMouseDown = () => {
    this.select();
  };

  public onCloseMouseDown = (e: any) => {
    e.stopPropagation();
  };

  public onCloseClick = () => {
    this.close();
  };

  public close() {
    const tabsTemp = app.tabs.list.filter(
      x => x.tabGroupId === this.tabGroupId,
    );
    const selected = app.tabs.selectedTabId === this.id;

    ipcRenderer.send('browserview-remove', this.id);

    // app.tabsapp.resetRearrangeTabsTimer();

    const notClosingTabs = tabsTemp.filter(x => !x.isClosing);
    let index = notClosingTabs.indexOf(this);

    this.isClosing = true;
    if (notClosingTabs.length - 1 === index) {
      const previousTab = tabsTemp[index - 1];
      if (previousTab) {
        this.setLeft(previousTab.getNewLeft() + this.getWidth(), true);
      }

      app.tabs.updateTabsBounds(true);
    }

    this.setWidth(0, true);
    app.tabs.setTabsLefts(true);

    if (selected) {
      index = tabsTemp.indexOf(this);

      if (index + 1 < tabsTemp.length && !tabsTemp[index + 1].isClosing) {
        const nextTab = tabsTemp[index + 1];
        nextTab.select();
      } else if (index - 1 >= 0 && !tabsTemp[index - 1].isClosing) {
        const prevTab = tabsTemp[index - 1];
        prevTab.select();
        // } else if (app.tabGroupsapp.groups.length === 1) {
      } else {
        closeWindow();
      }
    }

    setTimeout(() => {
      this.rootElement.remove();
      app.tabs.list.splice(app.tabs.list.indexOf(this), 1);
    }, TAB_ANIMATION_DURATION * 1000);
  }

  public select() {
    if (this.isClosing) return;

    const selectedTab = document.getElementsByClassName('tab-selected')[0];

    if (selectedTab) selectedTab.classList.remove('tab-selected');

    this.rootElement.classList.add('tab-selected');
    app.tabs.selectedTabId = this.id;

    ipcRenderer.send('browserview-select', this.id);
  }

  public getWidth(containerWidth: number = null, tabsTemp: Tab[] = null) {
    if (containerWidth === null) {
      containerWidth = app.tabs.container.offsetWidth;
    }

    if (tabsTemp === null) {
      tabsTemp = app.tabs.list.filter(
        x => x.tabGroupId === this.tabGroupId && !x.isClosing,
      );
    }

    const width = containerWidth / tabsTemp.length - TABS_PADDING;

    if (width > 200 - TABS_PADDING) {
      return 200 - TABS_PADDING;
    }
    if (width < 72 - TABS_PADDING) {
      return 72 - TABS_PADDING;
    }

    return width;
  }

  public getLeft() {
    const tabsTemp = app.tabs.list.filter(
      x => x.tabGroupId === this.tabGroupId && !x.isClosing,
    );
    const index = tabsTemp.indexOf(this);

    let left = 0;
    for (let i = 0; i < index; i++) {
      left += tabsTemp[i].width + TABS_PADDING;
    }

    return left;
  }

  public getNewLeft() {
    const tabsTemp = app.tabs.list.filter(
      x => x.tabGroupId === this.tabGroupId && !x.isClosing,
    );
    const index = tabsTemp.indexOf(this);

    let left = 0;
    for (let i = 0; i < index; i++) {
      left += this.getWidth() + TABS_PADDING;
    }

    return left;
  }

  public setLeft(left: number, animation: boolean) {
    app.tabs.animateProperty('x', this.rootElement, left, animation);
    this.left = left;
  }

  public setWidth(width: number, animation: boolean) {
    app.tabs.animateProperty('width', this.rootElement, width, animation);
    this.width = width;
  }
}
