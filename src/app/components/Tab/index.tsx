import { observer } from "mobx-react";
import React from "react";

// Mixins
import images from "../../../shared/mixins/images";

// Actions
import * as tabs from "../../actions/tabs";

// Interfaces
import { ITab, ITabGroup } from "../../interfaces";

// Constants and defaults
import { colors } from "nersent-ui";
import { TAB_MAX_WIDTH } from "../../constants/design";
import { tabAnimations } from "../../defaults/tabs";

// Utils
import { closeWindow } from "../../utils/window";

// Components
import { Ripples } from "nersent-ui";

// Styles
import { Close, StyledTab, Title } from "./styles";

import Store from "../../store";

interface IProps {
  key: number;
  tab: ITab;
  tabGroup: ITabGroup;
  selected: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  styles?: any;
}

@observer
export default class Tab extends React.Component<IProps, {}> {
  private ripples: Ripples;
  private iconRipples: Ripples;
  private tab: HTMLDivElement;

  public componentDidMount() {
    const { tab } = this.props;

    const frame = () => {
      if (this.tab != null) {
        const boundingRect = this.tab.getBoundingClientRect();
        if (Store.mouse.x >= boundingRect.left
          && Store.mouse.x <= boundingRect.left + this.tab.offsetWidth
          && Store.mouse.y >= boundingRect.top
          && Store.mouse.y <= boundingRect.top + this.tab.offsetHeight) {
          if (!tab.hovered) {
            tab.hovered = true;
          }
        } else {
          if (tab.hovered) {
            tab.hovered = false;
          }
        }
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.ripples.makeRipple(e.pageX, e.pageY);
    this.props.onMouseDown(e);
  };

  public onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    this.ripples.removeRipples();
  };

  public onCloseMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    this.iconRipples.makeRipple(e.pageX, e.pageY);
  };

  public onCloseMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    this.ripples.removeRipples();
  };

  public close = (e: React.MouseEvent<HTMLDivElement>) => {
    const { tabGroup, tab } = this.props;

    const tabIndex = tabGroup.tabs.indexOf(tab);

    if (
      tabIndex + 1 < tabGroup.tabs.length &&
      !tabGroup.tabs[tabIndex + 1].isRemoving
    ) {
      tabGroup.selectedTab = tabGroup.tabs[tabIndex + 1].id;
    } else if (tabIndex - 1 >= 0 && !tabGroup.tabs[tabIndex - 1].isRemoving) {
      tabGroup.selectedTab = tabGroup.tabs[tabIndex - 1].id;
    } else {
      if (Store.tabGroups.length === 1) {
        closeWindow();
      }
    }

    if (tabs.getScrollingMode(tabGroup) || tab.width === TAB_MAX_WIDTH) {
      tab.isRemoving = true;
      tabs.animateTab(tab, "width", 0);

      tabs.setTabsWidths();
      tabs.setTabsPositions();

      setTimeout(() => {
        tabs.removeTab(tab);
      }, tabAnimations.left.duration * 1000);
    } else {
      tabs.removeTab(tab);
      tabs.setTabsWidths();
      tabs.setTabsPositions();
    }
  };

  public styles() {
    return {
      tab: {},
      title: {},
      close: {}
    };
  }

  public render() {
    const { selected, tab, tabGroup } = this.props;
    const { left, width, title, id, isRemoving, hovered } = tab;

    const styles = {
      ...this.styles(),
      ...this.props.styles
    };

    return (
      <StyledTab
        selected={selected}
        style={{ left, width, ...styles.tab }}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        isRemoving={isRemoving}
        innerRef={r => this.tab = r}
      >
        <Title style={{ ...styles.title }}>{title}</Title>
        <Close
          onMouseDown={this.onCloseMouseDown}
          onMouseUp={this.onCloseMouseUp}
          onClick={this.close}
          hovered={hovered}
          style={{ ...styles.close }}
        >
          <Ripples
            icon={true}
            ref={r => (this.iconRipples = r)}
            color={"#000"}
            parentWidth={16}
            parentHeight={16}
            size={32}
            rippleTime={0.6}
            initialOpacity={0.1}
          />
        </Close>
        <Ripples
          rippleTime={0.6}
          ref={r => (this.ripples = r)}
          color={colors.blue["500"]}
        />
      </StyledTab>
    );
  }
}
