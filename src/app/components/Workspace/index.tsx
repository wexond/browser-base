import { Expo, TweenLite } from 'gsap';
import { observe } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import {
  Indicator, Scrollbar, ScrollbarThumb, Tabs, Root, AddTabButton,
} from './styles';
import { TOOLBAR_HEIGHT } from '../../constants';
import tabAnimations from '../../defaults/tab-animations';
import Tab from '../../models/tab';
import TabComponent from '../Tab';
import Workspace from '../../models/workspace';
import Store from '../../store';

const addTabIcon = require('../../../shared/icons/add.svg');

interface Props {
  workspace: Workspace;
}

@observer
export default class extends React.Component<Props, {}> {
  private tabs: HTMLDivElement;

  private wasVisible: boolean;

  private tabDragData = {
    dragging: false,
    mouseStartX: 0,
    startLeft: 0,
    lastMouseX: 0,
    direction: '',
  };

  private scrollData = {
    dragging: false,
    mouseStartX: 0,
    startLeft: 0,
    newScrollLeft: -1,
    maxScrollLeft: 0,
    lastScrollLeft: 0,
  };

  private scrollInterval: any;

  private scrollTimeout: any;

  public componentDidMount() {
    const { workspace } = this.props;

    window.addEventListener('resize', e => {
      if (!e.isTrusted) {
        return;
      }

      workspace.updateTabsBounds(false);

      const selectedTab = workspace.getSelectedTab();
      workspace.tabsIndicator.left = selectedTab.left;
      workspace.tabsIndicator.width = selectedTab.width;
    });

    this.resizeScrollbar();

    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);

    requestAnimationFrame(() => {
      workspace.addTab();
    });

    observe(workspace.tabs, (change: any) => {
      if (change.addedCount > 0 && change.removedCount === 0) {
        const tab = change.added[0] as Tab;
        const width = tab.getWidth();

        this.scrollData.maxScrollLeft += width;

        clearInterval(this.scrollInterval);

        this.scrollInterval = setInterval(() => {
          if (this.scrollData != null && this.tabs != null) {
            this.tabs.scrollLeft = this.scrollData.maxScrollLeft;
          }
        }, 1);

        clearTimeout(this.scrollTimeout);

        this.scrollTimeout = setTimeout(() => {
          clearInterval(this.scrollInterval);
        }, tabAnimations.left.duration * 1000);

        requestAnimationFrame(() => {
          tab.setLeft(tab.getLeft(), false);
          workspace.updateTabsBounds();
        });
      }
    });

    workspace.getContainerWidth = this.getTabsWidth;
  }

  componentWillUnmount() {
    const { workspace } = this.props;

    clearInterval(this.scrollInterval);
    workspace.tabs = [];
  }

  public getTabsWidth = () => this.tabs.offsetWidth;

  public resizeScrollbar = () => {
    if (this.props) {
      const { scrollWidth, offsetWidth, scrollLeft } = this.tabs;
      const { workspace } = this.props;
      const { scrollbar } = workspace;

      scrollbar.thumbWidth = offsetWidth ** 2 / scrollWidth;
      scrollbar.thumbLeft = (scrollLeft / scrollWidth) * offsetWidth;
      scrollbar.visible = Math.ceil(scrollbar.thumbWidth) !== Math.ceil(this.tabs.offsetWidth);

      requestAnimationFrame(this.resizeScrollbar);
    }
  };

  public onTabMouseDown = (e: React.MouseEvent<HTMLDivElement>, tab: Tab) => {
    this.tabDragData = {
      lastMouseX: 0,
      dragging: true,
      mouseStartX: e.pageX,
      startLeft: tab.left,
      direction: '',
    };

    Store.draggingTab = true;

    this.scrollData.lastScrollLeft = this.tabs.scrollLeft;
  };

  public onMouseEnter = () => {
    const { workspace } = this.props;
    workspace.scrollbar.thumbVisible = true;
  };

  public onMouseLeave = () => {
    const { workspace } = this.props;
    workspace.scrollbar.thumbVisible = false;
  };

  public onScrollbarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { workspace } = this.props;
    const { scrollbar } = workspace;

    clearInterval(this.scrollInterval);

    this.scrollData = {
      ...this.scrollData,
      dragging: true,
      mouseStartX: e.pageX,
      startLeft: scrollbar.thumbLeft,
    };
  };

  public onMouseUp = () => {
    const { workspace } = this.props;

    this.scrollData = {
      ...this.scrollData,
      dragging: false,
    };

    this.tabDragData.dragging = false;
    workspace.setTabsPositions();

    Store.draggingTab = false;

    const selectedTab = workspace.getSelectedTab();
    if (selectedTab != null) {
      workspace.tabsIndicator.moveToTab(selectedTab);
      selectedTab.dragging = false;
    }
  };

  public onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const { deltaX, deltaY } = e;
    const { scrollLeft, scrollWidth, offsetWidth } = this.tabs;

    let { newScrollLeft } = this.scrollData;

    const delta = Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : -deltaY;
    const target = delta / 2;

    clearInterval(this.scrollInterval);

    if (scrollLeft !== newScrollLeft && newScrollLeft !== -1) {
      newScrollLeft += target;
    } else {
      newScrollLeft = scrollLeft + target;
    }

    if (newScrollLeft > scrollWidth - offsetWidth) {
      newScrollLeft = scrollWidth - offsetWidth;
    }
    if (newScrollLeft < 0) {
      newScrollLeft = 0;
    }

    this.scrollData = {
      ...this.scrollData,
      newScrollLeft,
    };

    TweenLite.to(this.tabs, 0.3, {
      scrollLeft: newScrollLeft,
      ease: Expo.easeOut,
    });
  };

  public onAddTabButtonClick = () => {
    const { workspace } = this.props;
    workspace.addTab();
  };

  public onMouseMove = (e: any) => {
    if (!this.props) return;

    const { workspace } = this.props;
    const selectedTab = workspace.getSelectedTab();

    if (this.scrollData.dragging) {
      const { startLeft, mouseStartX } = this.scrollData;
      const { offsetWidth, scrollWidth } = this.tabs;
      this.tabs.scrollLeft = ((startLeft + e.pageX - mouseStartX) / offsetWidth) * scrollWidth;
    }
    if (this.tabDragData.dragging) {
      const { startLeft, mouseStartX } = this.tabDragData;
      const { scrollLeft } = this.tabs;

      const boundingRect = this.tabs.getBoundingClientRect();

      if (Math.abs(e.pageX - mouseStartX) < 5) {
        return;
      }

      selectedTab.dragging = true;
      Store.addressBar.canToggle = false;

      const newLeft = startLeft
        + e.pageX
        - mouseStartX
        - (this.scrollData.lastScrollLeft - scrollLeft);

      let left = newLeft;

      if (newLeft < 0) {
        left = 0;
      } else if (
        newLeft + selectedTab.width
        > workspace.addTabButton.left + scrollLeft
      ) {
        left = workspace.addTabButton.left - selectedTab.width;
      }

      selectedTab.setLeft(left, false);

      const createWindow = () => {
        // TODO: Create a new window
      };

      if (e.pageY > TOOLBAR_HEIGHT + 16 || e.pageY < -16) {
        createWindow();
      }

      if (e.pageX < boundingRect.left) {
        createWindow();
      }

      if (e.pageX - boundingRect.left > workspace.addTabButton.left) {
        createWindow();
      }

      TweenLite.to(workspace.tabsIndicator, 0, { left: selectedTab.left });

      let direction = '';
      if (this.tabDragData.lastMouseX - e.pageX >= 1) {
        direction = 'left';
      } else if (this.tabDragData.lastMouseX - e.pageX <= -1) {
        direction = 'right';
      }

      if (direction !== '') {
        this.tabDragData.direction = direction;
      }

      workspace.getTabsToReplace(selectedTab, this.tabDragData.direction);

      this.tabDragData.lastMouseX = e.pageX;
    }
  };

  public render() {
    const { workspace } = this.props;
    const { workspaces } = Store;
    const {
      visible,
      thumbWidth,
      thumbLeft,
      thumbVisible,
    } = workspace.scrollbar;

    const selected = workspace.id === workspaces.selected;

    let hiding = false;

    if (this.wasVisible && !selected) {
      hiding = true;
    }

    this.wasVisible = selected;

    return (
      <Root visible={selected} hiding={hiding}>
        <Tabs
          onWheel={this.onWheel}
          innerRef={(r: any) => (this.tabs = r)}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          {workspace.tabs.map(tab => (
            <TabComponent
              key={tab.id}
              workspace={workspace}
              tab={tab}
              selected={workspace.selectedTab === tab.id}
              onTabMouseDown={this.onTabMouseDown}
            />
          ))}
          <Indicator
            style={{
              width: workspace.tabsIndicator.width,
              left: workspace.tabsIndicator.left,
            }}
          />
        </Tabs>
        <AddTabButton
          icon={addTabIcon}
          onClick={this.onAddTabButtonClick}
          divRef={r => (workspace.addTabButton.ref = r)}
        />
        <Scrollbar visible={visible}>
          <ScrollbarThumb
            style={{
              width: thumbWidth,
              left: thumbLeft,
            }}
            visible={thumbVisible}
            onMouseDown={this.onScrollbarMouseDown}
          />
        </Scrollbar>
      </Root>
    );
  }
}
