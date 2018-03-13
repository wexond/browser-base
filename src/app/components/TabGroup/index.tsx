import { Expo, TweenLite } from "gsap";
import { observer } from "mobx-react";
import React from "react";

// Interfaces
import { ITab, ITabGroup } from "../../interfaces";

// Components
import styled from "styled-components";
import Tab from "../Tab";

// Constants and defaults
import { SYSTEM_BAR_HEIGHT, TABBAR_BUTTON_WIDTH } from "../../constants/design";
import { tabAnimations } from "../../defaults/tabs";

// Actions
import * as tabs from "../../actions/tabs";

import { observe } from "mobx";
import Store from "../../store";

interface IProps {
  tabGroup: ITabGroup;
}

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
    startLeft: 0
  };
  private scrollData = {
    dragging: false,
    mouseStartX: 0,
    startLeft: 0,
    newScrollLeft: -1,
    maxScrollLeft: 0
  };
  private interval: any;

  public componentDidMount() {
    Store.addTab = this.addTab;

    window.addEventListener("resize", e => {
      if (!e.isTrusted) {
        return;
      }

      tabs.setTabsWidths(false);
      tabs.setTabsPositions(false);

      const selectedTab = tabs.getTabById(this.props.tabGroup.selectedTab)
      this.props.tabGroup.lineLeft = selectedTab.newLeft;
      this.props.tabGroup.lineWidth = selectedTab.newWidth;
    });

    requestAnimationFrame(this.resizeScrollbar);

    window.addEventListener("mouseup", this.onScrollbarMouseUp);
    window.addEventListener("mousemove", this.onMouseMove);

    requestAnimationFrame(() => {
      this.addTab();
    }) 

    observe(this.props.tabGroup, change => {
      if (change.name === "selectedTab") {
        requestAnimationFrame(() => {
          const newTab = tabs.getTabById(change.newValue)
          TweenLite.to(this.props.tabGroup, tabAnimations.left.duration, { 
            lineWidth: newTab.newWidth,
            lineLeft: newTab.newLeft,
            ease: tabAnimations.left.easing
          })
        })
      }
    })
  }

  public resizeScrollbar = () => {
    this.setState({
      scrollbarThumbWidth:
        this.tabGroups.offsetWidth ** 2 / this.tabGroups.scrollWidth,
      scrollbarThumbLeft:
        this.tabGroups.scrollLeft /
        this.tabGroups.scrollWidth *
        this.tabGroups.offsetWidth,
      scrollbarVisible: this.state.scrollbarThumbWidth !== this.tabGroups.offsetWidth
    });

    requestAnimationFrame(this.resizeScrollbar);
  };

  public addTab = () => {
    const tab = tabs.addTab();
    const containerWidth = Store.getTabBarWidth();

    const width = tabs.getTabWidth(tab);

    tab.left = tabs.getTabLeft(tab);

    this.scrollData.maxScrollLeft += width;

    clearInterval(this.interval)

    let time = 0;
    this.interval = setInterval(() => {
      if (time < tabAnimations.left.duration * 1000) {
        this.tabGroups.scrollLeft = this.scrollData.maxScrollLeft;
      } else {
        clearInterval(this.interval);
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
      dragging: true,
      mouseStartX: e.pageX,
      startLeft: tab.left
    }
  }

  public onTabMouseUp = (e: React.MouseEvent<HTMLDivElement>, tab: ITab) => '';

  public onMouseEnter = () => {
    this.setState({ scrollbarThumbVisible: true });
  };

  public onMouseLeave = () => {
    this.setState({ scrollbarThumbVisible: false });
  };

  public onScrollbarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { scrollbarThumbLeft } = this.state;

    clearInterval(this.interval);

    this.scrollData = {
      ...this.scrollData,
      dragging: true,
      mouseStartX: e.pageX,
      startLeft: scrollbarThumbLeft
    };
  };

  public onScrollbarMouseUp = () => {
    this.scrollData = {
      ...this.scrollData,
      dragging: false
    }
  };

  public onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const { deltaX, deltaY } = e;
    let { newScrollLeft } = this.scrollData;

    const delta = (Math.abs(deltaX) >= Math.abs(deltaY)) ? deltaX : -deltaY;
    const target = delta / 2;

    clearInterval(this.interval);

    if (this.tabGroups.scrollLeft !== newScrollLeft && newScrollLeft !== -1) {
      newScrollLeft += target;
    } else {
      newScrollLeft = this.tabGroups.scrollLeft + target;
    }

    if (newScrollLeft > this.tabGroups.scrollWidth - this.tabGroups.offsetWidth) {
      newScrollLeft = this.tabGroups.scrollWidth - this.tabGroups.offsetWidth;
    }
    if (newScrollLeft < 0) {
      newScrollLeft = 0;
    }

    this.scrollData = {
      ...this.scrollData,
      newScrollLeft
    }

    TweenLite.to(this.tabGroups, 0.3, { scrollLeft: newScrollLeft, ease: Expo.easeOut })
  };

  public onMouseMove = (e: any) => {
    if (this.scrollData.dragging) {
      const { startLeft, mouseStartX } = this.scrollData;
      this.tabGroups.scrollLeft =
        (startLeft + e.pageX - mouseStartX) /
        this.tabGroups.offsetWidth *
        this.tabGroups.scrollWidth;
    }
    if (this.tabDragData.dragging) {
      const { startLeft, mouseStartX } = this.tabDragData
      // Move the tab
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
              onMouseDown={(e) => this.onTabMouseDown(e, tab)}
              onMouseUp={(e) => this.onTabMouseUp(e, tab)}
            />
          ))}
          <Line style={{width: tabGroup.lineWidth, left: tabGroup.lineLeft }}/>
        </Tabs>
        <Scrollbar 
          visible={this.state.scrollbarVisible}
        >
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

const Tabs = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
  width: calc(100% - ${TABBAR_BUTTON_WIDTH}px);
`;

interface IScrollbarProps {
  visible: boolean;
}

const Scrollbar = styled.div`
  position: absolute;
  height: 3px;
  bottom: 0;
  left: 0;
  z-index: 10;
  width: 100%;

  display: ${(props: IScrollbarProps) => props.visible ? "block" : "none"};
`;

interface IScrollbarThumbProps {
  visible: boolean;
}

const ScrollbarThumb = styled.div`
  position: absolute;
  background-color: black;
  opacity: ${(props: IScrollbarThumbProps) => (props.visible ? 0.2 : 0)};
  height: 100%;
  top: 0;
  left: 0;
  transition: 0.2s opacity;

  &:hover {
    opacity: 0.4;
  }

  &:active {
    opacity: 0.4;
  }
`;

const Line = styled.div`
  background-color: #2196F3;
  height: 2px;
  width: 200px;
  bottom: 0;
  position: absolute;
  z-index: 3;
`;