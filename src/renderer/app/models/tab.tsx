import app from '..';
import { ipcRenderer } from 'electron';
import { TABS_PADDING, TAB_ANIMATION_DURATION } from '../constants';
import { closeWindow } from '../utils';
import { createElement } from 'ui';
import { shadeBlendConvert, getColorBrightness } from '../utils/colors';

let id = 0;

export class Tab {
  public root: HTMLElement;
  public titleElement: HTMLElement;
  public rightBorder: HTMLElement;
  public closeElement: HTMLElement;
  public faviconElement: HTMLElement;
  public tabOverlay: HTMLElement;

  public width = 0;
  public left = 0;

  public tabGroupId = 0;
  public id = id++;

  public isDragging = false;
  public isHovered = false;

  private _favicon: string = '';
  private _title: string;
  private _background: string | null = null;

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
        <div className="tab-overlay" ref={r => (this.tabOverlay = r)} />
      </div>
    ) as any;

    this.background = null;

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
        console.log(favicon);
        this.favicon = favicon;
      },
    );

    ipcRenderer.on(
      `browserview-theme-color-updated-${this.id}`,
      (e: any, themeColor: string) => {
        console.log(themeColor);
        this.background = themeColor;
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

  public get nextTab() {
    return app.tabs.list[app.tabs.list.indexOf(this) + 1];
  }

  public get favicon() {
    return this._favicon;
  }

  public set favicon(value: string) {
    const image = new Image();
    image.onerror = () => {
      this.faviconElement.style.opacity = '0';
      this.titleElement.style.marginLeft = '0';
      this._favicon = '';
    };

    image.onload = () => {
      this.faviconElement.style.opacity = '1';
      this.titleElement.style.marginLeft = '26px';
      this._favicon = value;
    };

    image.src = value;

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

  public get background() {
    return this._background;
  }

  public set background(value: string | null) {
    if (value && getColorBrightness(value) > 170) {
      return;
    }

    this._background = value || '#2196F3';
    this.update();
  }

  public update = () => {
    const canHideSeparator = this.isHovered || this.selected;

    if (this.previousTab) {
      this.previousTab.rightBorderVisible = !canHideSeparator;
    }

    this.rightBorderVisible = !canHideSeparator;

    if (this.nextTab && this.nextTab.selected) {
      this.rightBorderVisible = false;
    }

    if (this.selected) {
      this.root.classList.add('selected');

      this.root.style.backgroundColor = shadeBlendConvert(
        0.85,
        this.background,
      );
      this.titleElement.style.color = this.background;
      this.tabOverlay.style.backgroundColor = shadeBlendConvert(
        0.8,
        this.background,
      );
    } else {
      this.root.classList.remove('selected');

      this.titleElement.style.color = 'rgba(0, 0, 0, 0.87)';
      this.root.style.backgroundColor = 'transparent';
      this.tabOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
    }

    if (this.isHovered) {
      this.root.classList.add('hover');
    } else {
      this.root.classList.remove('hover');
    }
  };

  public onMouseEnter = () => {
    this.update();
  };

  public onMouseLeave = () => {
    this.update();
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

    app.tabs.selectedTabId = this.id;

    if (selectedTab) {
      selectedTab.update();
    }

    this.update();

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
