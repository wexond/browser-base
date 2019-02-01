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
  public closeElement: HTMLElement;
  public faviconElement: HTMLElement;

  public width = 0;
  public left = 0;

  public tabGroupId = 0;
  public id = id++;

  public isDragging = false;
  public isHovered = false;

  private _favicon: string = '';
  private _title: string;

  constructor() {
    this.root = (
      <div className="tab" onMouseDown={this.onMouseDown}>
        <div className="tab-content">
          <div className="tab-icon" ref={r => (this.faviconElement = r)} />
          <div ref={r => (this.titleElement = r)} className="tab-title">
            New tab
          </div>
        </div>
        <div
          className="tab-close"
          onClick={this.onCloseClick}
          onMouseDown={this.onCloseMouseDown}
          ref={r => (this.closeElement = r)}
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

    ipcRenderer.on(
      `browserview-favicon-updated-${this.id}`,
      (e: any, favicon: string) => {
        this.favicon = favicon;
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

    requestAnimationFrame(this.tick);
  };

  public get selected() {
    return app.tabs.selectedTabId === this.id;
  }

  public get previousTab() {
    return app.tabs.list[app.tabs.list.indexOf(this) - 1];
  }

  public get favicon() {
    return this._favicon;
  }

  public set favicon(value: string) {
    this.faviconElement.style.opacity = value === '' ? '0' : '1';
    this.titleElement.style.marginLeft = value === '' ? '0' : '26px';

    this._favicon = value;
    this.faviconElement.style.backgroundImage = `url(${value})`;
  }

  public get title() {
    return this._title;
  }

  public set title(newTitle: string) {
    this.titleElement.textContent = newTitle;
    this._title = newTitle;
  }

  public set rightBorderVisible(value: boolean) {
    this.rightBorder.style.display = value ? 'block' : 'none';
  }

  public onMouseEnter = () => {
    this.root.classList.add('hover');

    const previousTab = this.previousTab;
    if (previousTab) {
      previousTab.rightBorderVisible = false;
    }
  };

  public onMouseLeave = () => {
    this.root.classList.remove('hover');

    const previousTab = this.previousTab;
    if (previousTab && !this.selected) {
      previousTab.rightBorderVisible = true;
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

    if (this.selected) {
      index = tabsTemp.indexOf(this);

      if (index + 1 < tabsTemp.length) {
        const nextTab = tabsTemp[index + 1];
        nextTab.select();
      } else if (index - 1 >= 0) {
        const prevTab = tabsTemp[index - 1];
        prevTab.select();
        // } else if (app.tabGroups.groups.length === 1) {
      } else {
        closeWindow();
      }
    }

    app.tabs.list.splice(index, 1);

    if (app.tabs.list.length === index) {
      const previousTab = tabsTemp[index - 1];
      if (previousTab) {
        this.setLeft(previousTab.getNewLeft() + this.getWidth(), true);
      }

      app.tabs.updateTabsBounds(true);
    }

    this.setWidth(0, true);
    app.tabs.setTabsLefts(true);

    setTimeout(() => {
      this.root.remove();
    }, TAB_ANIMATION_DURATION * 1000);
  }

  public select() {
    const { selectedTab } = app.tabs;

    if (selectedTab) {
      selectedTab.rightBorderVisible = true;
      selectedTab.root.classList.remove('selected');

      const previousTab = selectedTab.previousTab;
      if (previousTab) {
        previousTab.rightBorderVisible = true;
      }
    }

    this.root.classList.add('selected');
    this.rightBorderVisible = false;

    app.tabs.selectedTabId = this.id;

    const previousTab = this.previousTab;
    if (previousTab) {
      previousTab.rightBorderVisible = false;
    }

    ipcRenderer.send('browserview-select', this.id);
  }

  public getWidth(containerWidth: number = null, tabsTemp: Tab[] = null) {
    if (containerWidth === null) {
      containerWidth = app.tabs.container.offsetWidth;
    }

    if (tabsTemp === null) {
      tabsTemp = app.tabs.list.filter(x => x.tabGroupId === this.tabGroupId);
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
      x => x.tabGroupId === this.tabGroupId,
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
      x => x.tabGroupId === this.tabGroupId,
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
    if (width > 72) {
      this.root.classList.add('close-visible');
    } else {
      this.root.classList.remove('close-visible');
    }

    app.tabs.animateProperty('width', this.root, width, animation);
    this.width = width;
  }
}
