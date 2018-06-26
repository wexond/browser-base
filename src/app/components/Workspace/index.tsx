import { Expo, TweenLite } from 'gsap';
import { observe } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import {
  Indicator, Scrollbar, ScrollbarThumb, Tabs,
} from './styles';
import { TOOLBAR_HEIGHT } from '../../constants';
import tabAnimations from '../../defaults/tab-animations';
import Tab from '../../models/tab';
import TabComponent from '../Tab';
import Workspace from '../../models/workspace';
import Store from '../../store';

interface Props {
  workspace: Workspace;
}

@observer
export default class extends React.Component<Props, {}> {
  public state = {
    scrollbarThumbWidth: 0,
    scrollbarThumbLeft: 0,
    scrollbarThumbVisible: false,
    scrollbarVisible: false,
  };

  private workspaces: HTMLDivElement;

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

  private mounted = true;

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
          if (this.scrollData != null && this.workspaces != null) {
            this.workspaces.scrollLeft = this.scrollData.maxScrollLeft;
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
  }

  componentWillUnmount() {
    const { workspace } = this.props;

    clearInterval(this.scrollInterval);
    this.mounted = false;
    workspace.tabs = [];
  }

  public resizeScrollbar = () => {
    if (!this.mounted) return;

    const { scrollbarThumbWidth } = this.state;

    this.setState({
      scrollbarThumbWidth: this.workspaces.offsetWidth ** 2 / this.workspaces.scrollWidth,
      scrollbarThumbLeft:
        (this.workspaces.scrollLeft / this.workspaces.scrollWidth) * this.workspaces.offsetWidth,
      scrollbarVisible: Math.ceil(scrollbarThumbWidth) !== Math.ceil(this.workspaces.offsetWidth),
    });

    if (this.mounted) {
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

    this.scrollData.lastScrollLeft = this.workspaces.scrollLeft;
  };

  public onMouseEnter = () => {
    this.setState({ scrollbarThumbVisible: true });
  };

  public onMouseLeave = () => {
    this.setState({ scrollbarThumbVisible: false });
  };

  public onScrollbarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { scrollbarThumbLeft } = this.state;

    clearInterval(this.scrollInterval);

    this.scrollData = {
      ...this.scrollData,
      dragging: true,
      mouseStartX: e.pageX,
      startLeft: scrollbarThumbLeft,
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
    let { newScrollLeft } = this.scrollData;

    const delta = Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : -deltaY;
    const target = delta / 2;

    clearInterval(this.scrollInterval);

    if (this.workspaces.scrollLeft !== newScrollLeft && newScrollLeft !== -1) {
      newScrollLeft += target;
    } else {
      newScrollLeft = this.workspaces.scrollLeft + target;
    }

    if (newScrollLeft > this.workspaces.scrollWidth - this.workspaces.offsetWidth) {
      newScrollLeft = this.workspaces.scrollWidth - this.workspaces.offsetWidth;
    }
    if (newScrollLeft < 0) {
      newScrollLeft = 0;
    }

    this.scrollData = {
      ...this.scrollData,
      newScrollLeft,
    };

    TweenLite.to(this.workspaces, 0.3, {
      scrollLeft: newScrollLeft,
      ease: Expo.easeOut,
    });
  };

  public onMouseMove = (e: any) => {
    const { workspace } = this.props;
    const selectedTab = workspace.getSelectedTab();

    if (this.scrollData.dragging) {
      const { startLeft, mouseStartX } = this.scrollData;
      this.workspaces.scrollLeft = ((startLeft + e.pageX - mouseStartX)
        / this.workspaces.offsetWidth)
        * this.workspaces.scrollWidth;
    }
    if (this.tabDragData.dragging) {
      const { startLeft, mouseStartX } = this.tabDragData;

      const boundingRect = this.workspaces.getBoundingClientRect();

      if (Math.abs(e.pageX - mouseStartX) < 5) {
        return;
      }

      selectedTab.dragging = true;
      Store.addressBar.canToggle = false;

      const newLeft = startLeft
        + e.pageX
        - mouseStartX
        - (this.scrollData.lastScrollLeft - this.workspaces.scrollLeft);

      let left = newLeft;

      if (newLeft < 0) {
        left = 0;
      } else if (
        newLeft + selectedTab.width
        > Store.addTabButton.left + this.workspaces.scrollLeft
      ) {
        left = Store.addTabButton.left - selectedTab.width;
      }

      selectedTab.setLeft(left, false);

      const createWindow = () => {
        // Create a new window
      };

      if (e.pageY > TOOLBAR_HEIGHT + 16 || e.pageY < -16) {
        createWindow();
      }

      if (e.pageX < boundingRect.left) {
        createWindow();
      }

      if (e.pageX - boundingRect.left > Store.addTabButton.left) {
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
    const {
      scrollbarVisible,
      scrollbarThumbWidth,
      scrollbarThumbLeft,
      scrollbarThumbVisible,
    } = this.state;

    return (
      <React.Fragment>
        <Tabs
          onWheel={this.onWheel}
          innerRef={(r: any) => (this.workspaces = r)}
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
        <Scrollbar visible={scrollbarVisible}>
          <ScrollbarThumb
            style={{
              width: scrollbarThumbWidth,
              left: scrollbarThumbLeft,
            }}
            visible={scrollbarThumbVisible}
            onMouseDown={this.onScrollbarMouseDown}
          />
        </Scrollbar>
      </React.Fragment>
    );
  }
}
