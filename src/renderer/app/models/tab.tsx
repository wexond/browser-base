import app from '..';
import { ipcRenderer } from 'electron';
import { TABS_PADDING, TAB_ANIMATION_DURATION } from '../constants';
import { closeWindow } from '../utils';
import { createElement } from 'ui';

let id = 0;

export class Tab {
  public root: HTMLElement;
  public titleElement: HTMLElement;
  public rightBorder: HTMLElement;

  public width = 0;
  public left = 0;

  public tabGroupId = 0;
  public id = id++;

  public isDragging = false;
  public isClosing = false;
  public isHovered = false;

  private _title: string;

  constructor() {
    this.root = (
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
        <div className="tab-right-border" ref={r => (this.rightBorder = r)} />
      </div>
    ) as any;

    app.tabs.container.appendChild(this.root);

    ipcRenderer.send('browserview-create', this.id);

    ipcRenderer.on(
      `browserview-title-updated-${this.id}`,
      (e: any, title: string) => {
        this.title = title;
      },
    );

    requestAnimationFrame(this.tick);
  }

  public tick = () => {
    const { top, height, left, width } = this.root.getBoundingClientRect();

    if (
      app.mouse.x >= left &&
      app.mouse.x <= left + width &&
      app.mouse.y >= top &&
      app.mouse.y <= height + top &&
      !app.tabs.isDragging
    ) {
      if (!this.isHovered) {
        this.isHovered = true;
        this.onMouseEnter();
      }
    } else if (this.isHovered) {
      this.isHovered = false;
      this.onMouseLeave();
    }

    if (!this.isClosing) {
      requestAnimationFrame(this.tick);
    }
  };

  public get selected() {
    return app.tabs.selectedTabId === this.id;
  }

  public get previousTab() {
    return app.tabs.list[app.tabs.list.indexOf(this) - 1];
  }

  public get title() {
    return this._title;
  }

  public set title(newTitle: string) {
    this.titleElement.textContent = newTitle;
    this._title = newTitle;
  }

  public onMouseEnter = () => {
    this.root.classList.add('hover');

    const previousTab = this.previousTab;
    if (previousTab) {
      previousTab.rightBorder.style.display = 'none';
    }
  };

  public onMouseLeave = () => {
    this.root.classList.remove('hover');

    const previousTab = this.previousTab;
    if (previousTab && !this.selected && !this.isClosing) {
      previousTab.rightBorder.style.display = 'block';
    }
  };

  public onMouseDown = (e: any) => {
    e = e as MouseEvent;

    const { pageX, pageY } = e;

    app.tabs.lastMouseX = 0;
    app.tabs.isDragging = true;
    app.tabs.mouseStartX = pageX;
    app.tabs.tabStartX = this.left;
    app.tabs.lastScrollX = app.tabs.container.scrollLeft;

    // TODO: ripple

    this.select();
  };

  public onCloseMouseDown = (e: any) => {
    e = e as MouseEvent;

    e.stopPropagation();
  };

  public onCloseClick = () => {
    this.close();
  };

  public close() {
    const tabsTemp = app.tabs.list.filter(
      x => x.tabGroupId === this.tabGroupId,
    );

    ipcRenderer.send('browserview-remove', this.id);

    app.tabs.resetRearrangeTabsTimer();

    let index = app.tabs.list.indexOf(this);

    this.isClosing = true;
    if (app.tabs.list.length - 1 === index) {
      const previousTab = tabsTemp[index - 1];
      if (previousTab) {
        this.setLeft(previousTab.getNewLeft() + this.getWidth(), true);
      }

      app.tabs.updateTabsBounds(true);
    }

    this.setWidth(0, true);
    app.tabs.setTabsLefts(true);

    if (this.selected) {
      index = tabsTemp.indexOf(this);

      if (index + 1 < tabsTemp.length && !tabsTemp[index + 1].isClosing) {
        const nextTab = tabsTemp[index + 1];
        nextTab.select();
      } else if (index - 1 >= 0 && !tabsTemp[index - 1].isClosing) {
        const prevTab = tabsTemp[index - 1];
        prevTab.select();
        // } else if (app.tabGroups.groups.length === 1) {
      } else {
        closeWindow();
      }
    }

    app.tabs.list.splice(index, 1);

    app.tabs.selectedTab.select();

    setTimeout(() => {
      this.root.remove();
    }, TAB_ANIMATION_DURATION * 1000);
  }

  public select() {
    if (this.isClosing) return;

    const { selectedTab } = app.tabs;
    const { scrollLeft, scrollWidth, offsetWidth } = app.tabs.container;

    if (selectedTab) {
      selectedTab.rightBorder.style.display = 'block';
      selectedTab.root.classList.remove('tab-selected');

      const previousTab = selectedTab.previousTab;
      if (previousTab) {
        previousTab.rightBorder.style.display = 'block';
      }
    }

    this.root.classList.add('tab-selected');
    this.rightBorder.style.display = 'none';

    app.tabs.selectedTabId = this.id;

    const previousTab = this.previousTab;
    if (previousTab) {
      previousTab.rightBorder.style.display = 'none';
    }

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

    if (width > 200) {
      return 200;
    }
    if (width < 72) {
      return 72;
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
    app.tabs.animateProperty('x', this.root, left, animation);
    this.left = left;
  }

  public setWidth(width: number, animation: boolean) {
    app.tabs.animateProperty('width', this.root, width, animation);
    this.width = width;
  }
}
