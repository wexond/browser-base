import { Expo, TweenLite } from "gsap";
import { observe } from "mobx";
import { observer } from "mobx-react";
import React from "react";

// Interfaces
import { ITab, ITabGroup } from "../../interfaces";

// Components
import Tab from "../Tab";

// Constants and defaults
import { tabAnimations } from "../../defaults/tabs";

// Actions
import * as tabs from "../../actions/tabs";

// Styles
import { Line, Scrollbar, ScrollbarThumb, Tabs } from "./styles";

import Store from "../../store";

interface IProps {
  tabGroup: ITabGroup;
}

@observer
export default class TabGroup extends React.Component<IProps, {}> {
  public state = {
    scrollbarThumbWidth: 0,
    scrollbarThumbLeft: 0,
    scrollbarThumbVisible: false,
    scrollbarVisible: false
  };

  private tabGroups: HTMLDivElement;
  private tabDragData = {
    dragging: false,
    mouseStartX: 0,
    startLeft: 0,
    lastMouseX: 0,
    direction: ""
  };
  private scrollData = {
    dragging: false,
    mouseStartX: 0,
    startLeft: 0,
    newScrollLeft: -1,
    maxScrollLeft: 0,
    lastScrollLeft: 0
  };
  private scrollInterval: any;
  private tabsInterval: any;

  public componentDidMount() {
    const { tabGroup } = this.props;

    Store.addTab = this.addTab;

    window.addEventListener("resize", e => {
      if (!e.isTrusted) {
        return;
      }

      tabs.setTabsWidths(false);
      tabs.setTabsPositions(false);

      const selectedTab = tabs.getTabById(tabGroup.selectedTab);
      tabGroup.lineLeft = selectedTab.newLeft;
      tabGroup.lineWidth = selectedTab.newWidth;
    });

    requestAnimationFrame(this.resizeScrollbar);

    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("mousemove", this.onMouseMove);

    requestAnimationFrame(() => {
      this.addTab();
    });

    observe(tabGroup, change => {
      if (change.name === "selectedTab") {
        requestAnimationFrame(() => {
          tabs.animateLine(tabGroup, tabs.getTabById(change.newValue));
        });
      }
    });
  }

  public resizeScrollbar = () => {
    this.setState({
      scrollbarThumbWidth:
        this.tabGroups.offsetWidth ** 2 / this.tabGroups.scrollWidth,
      scrollbarThumbLeft:
        this.tabGroups.scrollLeft /
        this.tabGroups.scrollWidth *
        this.tabGroups.offsetWidth,
      scrollbarVisible:
        this.state.scrollbarThumbWidth !== this.tabGroups.offsetWidth
    });

    requestAnimationFrame(this.resizeScrollbar);
  };

  public addTab = () => {
    const tab = tabs.addTab();
    const containerWidth = Store.getTabBarWidth();

    const width = tabs.getTabWidth(tab);

    tab.left = tabs.getTabLeft(tab);

    this.scrollData.maxScrollLeft += width;

    clearInterval(this.scrollInterval);

    let time = 0;
    this.scrollInterval = setInterval(() => {
      if (time < tabAnimations.left.duration * 1000) {
        this.tabGroups.scrollLeft = this.scrollData.maxScrollLeft;
      } else {
        clearInterval(this.scrollInterval);
      }

      time += 1;
    }, 1);

    tabs.setTabsWidths();
    tabs.setTabsPositions();
  };

  public onTabMouseDown = (e: React.MouseEvent<HTMLDivElement>, tab: ITab) => {
    const { left } = tab;

    tabs.selectTab(tab);
    this.tabDragData = {
      lastMouseX: 0,
      dragging: true,
      mouseStartX: e.pageX,
      startLeft: tab.left,
      direction: ""
    };

    this.scrollData.lastScrollLeft = this.tabGroups.scrollLeft;
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
      startLeft: scrollbarThumbLeft
    };
  };

  public onMouseUp = () => {
    const { tabGroup } = this.props;

    this.scrollData = {
      ...this.scrollData,
      dragging: false
    };

    this.tabDragData.dragging = false;
    tabs.setTabsPositions();

    tabs.animateLine(tabGroup, tabs.getTabById(tabGroup.selectedTab));
  };

  public onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const { deltaX, deltaY } = e;
    let { newScrollLeft } = this.scrollData;

    const delta = Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : -deltaY;
    const target = delta / 2;

    clearInterval(this.scrollInterval);

    if (this.tabGroups.scrollLeft !== newScrollLeft && newScrollLeft !== -1) {
      newScrollLeft += target;
    } else {
      newScrollLeft = this.tabGroups.scrollLeft + target;
    }

    if (
      newScrollLeft >
      this.tabGroups.scrollWidth - this.tabGroups.offsetWidth
    ) {
      newScrollLeft = this.tabGroups.scrollWidth - this.tabGroups.offsetWidth;
    }
    if (newScrollLeft < 0) {
      newScrollLeft = 0;
    }

    this.scrollData = {
      ...this.scrollData,
      newScrollLeft
    };

    TweenLite.to(this.tabGroups, 0.3, {
      scrollLeft: newScrollLeft,
      ease: Expo.easeOut
    });
  };

  public onMouseMove = (e: any) => {
    const { tabGroup } = this.props;
    const selectedTab = tabs.getTabById(tabGroup.selectedTab);

    if (this.scrollData.dragging) {
      const { startLeft, mouseStartX } = this.scrollData;
      this.tabGroups.scrollLeft =
        (startLeft + e.pageX - mouseStartX) /
        this.tabGroups.offsetWidth *
        this.tabGroups.scrollWidth;
    }
    if (this.tabDragData.dragging) {
      const { startLeft, mouseStartX } = this.tabDragData;

      const boundingRect = this.tabGroups.getBoundingClientRect();

      let direction = "";
      if (this.tabDragData.lastMouseX - e.pageX === 1) {
        direction = "left"
      } else if (this.tabDragData.lastMouseX - e.pageX === -1) {
        direction = "right";
      }

      if (direction !== "") {
        this.tabDragData.direction = direction;
      }

      const newLeft = startLeft + e.pageX - mouseStartX - (this.scrollData.lastScrollLeft - this.tabGroups.scrollLeft);

      if (newLeft < 0) {
        selectedTab.left = 0;
      } else if (Store.addTabButton.left === "auto") {
        if (newLeft + selectedTab.width > this.tabGroups.scrollWidth) {
          selectedTab.left = this.tabGroups.scrollWidth - selectedTab.width;
        } else {
          selectedTab.left = newLeft;
        }
      } else if (typeof Store.addTabButton.left === "number") {
        if (newLeft + selectedTab.width > (Store.addTabButton.left as number)) {
          selectedTab.left = Store.addTabButton.left - selectedTab.width;
        } else {
          selectedTab.left = newLeft;
        }
      }

      tabGroup.lineLeft = selectedTab.left;

      const tab = tabs.getTabUnderTab(selectedTab, this.tabDragData.direction);
      if (tab != null) {
        tabs.replaceTab(selectedTab, tab);
      }

      this.tabDragData.lastMouseX = e.pageX;
    }
  };

  public render() {
    const { tabGroup } = this.props;

    return (
      <>
        <Tabs
          onWheel={this.onWheel}
          innerRef={(r: any) => (this.tabGroups = r)}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          {tabGroup.tabs.map((tab: ITab) => (
            <Tab
              key={tab.id}
              tabGroup={tabGroup}
              tab={tab}
              selected={tabGroup.selectedTab === tab.id}
              onMouseDown={e => this.onTabMouseDown(e, tab)}
            />
          ))}
          <Line
            style={{ width: tabGroup.lineWidth, left: tabGroup.lineLeft }}
          />
        </Tabs>
        <Scrollbar visible={this.state.scrollbarVisible}>
          <ScrollbarThumb
            style={{
              width: this.state.scrollbarThumbWidth,
              left: this.state.scrollbarThumbLeft
            }}
            visible={this.state.scrollbarThumbVisible}
            onMouseDown={this.onScrollbarMouseDown}
          />
        </Scrollbar>
      </>
    );
  }
}
