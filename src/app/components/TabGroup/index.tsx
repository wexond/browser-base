import { observer } from "mobx-react";
import React from "react";

// Interfaces
import { ITab, ITabGroup } from "../../interfaces";

// Components
import styled from "styled-components";
import Tab from "../Tab";

// Constants and defaults
import { SYSTEM_BAR_HEIGHT } from "../../constants/design";
import { tabTransitions } from "../../defaults/tabs";

// Actions
import * as tabs from "../../actions/tabs";

import anime, { AnimeInstance } from "animejs";
import Store from "../../store";

interface IProps {
  tabGroup: ITabGroup;
}

export default class TabGroup extends React.Component<IProps, {}> {
  public state = {
    scrollbarThumbWidth: 0,
    scrollbarWidth: 0,
    scrollLeft: 0,
    scrollbarVisible: false
  };

  private tabGroups: HTMLDivElement;
  private scrollLeft = 0;
  private tabDragging = false;
  private scrollbarThumbDragging = false;
  private mouseStartX = 0;
  private startLeft = 0;
  private animation: AnimeInstance;
  private newScrollLeft: number = -1;

  public componentDidMount() {
    Store.addTab = this.addTab;

    window.addEventListener("resize", e => {
      if (!e.isTrusted) {
        return;
      }

      tabs.setTabsWidths(false);
      tabs.setTabsPositions(false);
    });

    requestAnimationFrame(this.resizeScrollbar);

    window.addEventListener("mouseup", this.onScrollbarMouseUp);
    window.addEventListener("mousemove", this.onMouseMove);
  }

  public resizeScrollbar = () => {
    this.setState({
      scrollbarThumbWidth:
        this.tabGroups.offsetWidth ** 2 / this.tabGroups.scrollWidth,
      scrollbarWidth: this.scrollLeft,
      scrollLeft:
        this.tabGroups.scrollLeft /
        this.tabGroups.scrollWidth *
        this.tabGroups.offsetWidth
    });

    requestAnimationFrame(this.resizeScrollbar);
  };

  public addTab = () => {
    const tab = tabs.addTab();
    const containerWidth = Store.getTabBarWidth();

    const width = tabs.getTabWidth(tab);

    tab.left = tabs.getTabLeft(tab);

    this.scrollLeft += width + 100;

    let time = 0;
    const interval = setInterval(() => {
      if (time < tabTransitions.left.duration * 1000) {
        this.tabGroups.scrollLeft = this.scrollLeft;
        this.newScrollLeft = this.tabGroups.scrollLeft;
      } else {
        clearInterval(interval);
      }

      time += 1;
    }, 1);

    tabs.setTabsWidths();
    tabs.setTabsPositions();
  };

  public onTabMouseDown = (e: React.MouseEvent<HTMLDivElement>, tab: ITab) => {
    tabs.selectTab(tab);
    this.tabDragging = true;
    this.mouseStartX = e.pageX;
    this.startLeft = this.state.scrollLeft;
  }
  public onTabMouseUp = (tab: ITab) => {
    console.log(tab)
  }
  public onMouseEnter = () => {
    this.setState({ scrollbarVisible: true });
  };

  public onMouseLeave = () => {
    this.setState({ scrollbarVisible: false });
  };

  public onScrollbarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.scrollbarThumbDragging = true;
    this.mouseStartX = e.pageX;
    this.startLeft = this.state.scrollLeft;
  };

  public onScrollbarMouseUp = () => {
    this.tabDragging = false;
    this.scrollbarThumbDragging = false;
  };

  public onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const { deltaX, deltaY } = e;
    const target = deltaY / 2;

    if (this.tabGroups.scrollLeft !== this.newScrollLeft && this.newScrollLeft !== -1) {
      this.newScrollLeft += target;
    } else {
      this.newScrollLeft = this.tabGroups.scrollLeft + target;
    }

    if (this.newScrollLeft > this.tabGroups.scrollWidth - this.tabGroups.offsetWidth) {
      this.newScrollLeft = this.tabGroups.scrollWidth - this.tabGroups.offsetWidth;
    }
    if (this.newScrollLeft < 0) {
      this.newScrollLeft = 0;
    }

    anime.remove(this.tabGroups)

    anime({
      targets: this.tabGroups,
      scrollLeft: this.newScrollLeft,
      duration: 250,
      easing: 'easeOutCubic'
    })
  };

  public onMouseMove = (e: any) => {
    if (this.scrollbarThumbDragging) {
      this.tabGroups.scrollLeft =
        (this.startLeft + e.pageX - this.mouseStartX) /
        this.tabGroups.offsetWidth *
        this.tabGroups.scrollWidth;
    }
    if (this.tabDragging) {
      // Move the tab
    }  
  };

  public render() {
    const { tabGroup } = this.props;
    return (
      <>
        <TabGroups
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
              onMouseUp={() => this.onTabMouseUp(tab)}
            />
          ))}
        </TabGroups>
        <Scrollbar>
          <ScrollbarThumb
            style={{
              width: this.state.scrollbarThumbWidth,
              display:
                this.tabGroups == null ||
                  this.state.scrollbarThumbWidth === this.tabGroups.offsetWidth
                  ? "none"
                  : "block",
              left: this.state.scrollLeft
            }}
            visible={this.state.scrollbarVisible}
            onMouseMove={this.onMouseMove}
            onMouseDown={this.onScrollbarMouseDown}
          />
        </Scrollbar>
      </>
    );
  }
}

const TabGroups = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
  width: calc(100% - ${SYSTEM_BAR_HEIGHT}px);
`;

const Scrollbar = styled.div`
  position: absolute;
  height: 3px;
  bottom: 0;
  left: 0;
  z-index: 10;
  width: 100%;
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
