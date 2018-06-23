import { observer } from 'mobx-react';
import React from 'react';
import { Close, Content, Icon, Overlay, StyledTab, Title, RightBorder } from './styles';
import tabAnimations from '../../defaults/tab-animations';
import Tab from '../../models/tab';
import TabGroup from '../../models/tab-group';
import Store from '../../store';
import { closeWindow } from '../../utils/window';

import Ripples from '../../../shared/components/Ripples';

export interface TabProps {
  key: number;
  tab: Tab;
  tabGroup: TabGroup;
  selected: boolean;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTabMouseDown?: (e?: React.MouseEvent<HTMLDivElement>, tab?: Tab) => void;
  style?: any;
}

@observer
export default class extends React.Component<TabProps, {}> {
  private ripples: Ripples;
  private iconRipples: Ripples;
  private tab: HTMLDivElement;

  public componentDidMount() {
    const { tab } = this.props;

    const frame = () => {
      if (this.tab != null) {
        const boundingRect = this.tab.getBoundingClientRect();
        if (
          Store.mouse.x >= boundingRect.left &&
          Store.mouse.x <= boundingRect.left + this.tab.offsetWidth &&
          Store.mouse.y >= boundingRect.top &&
          Store.mouse.y <= boundingRect.top + this.tab.offsetHeight
        ) {
          if (!tab.hovered) {
            tab.hovered = true;
          }
        } else if (tab.hovered) {
          tab.hovered = false;
        }
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { selected, tab, tabGroup } = this.props;
    const { pageX, pageY } = e;

    Store.addressBar.canToggle = selected;
    setTimeout(() => {
      if (tab !== tabGroup.getSelectedTab()) {
        tabGroup.selectTab(tab);
      }
    });
    this.props.onTabMouseDown(e, tab);
    this.ripples.makeRipple(pageX, pageY);
  };

  public onMouseUp = () => {
    this.ripples.removeRipples();
  };

  public onCloseMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    this.iconRipples.makeRipple(e.pageX, e.pageY);
  };

  public onCloseMouseUp = () => {
    this.ripples.removeRipples();
  };

  public onClick = () => {
    if (Store.addressBar.canToggle) {
      Store.addressBar.toggled = true;
    }
  };

  public onClose = (e: React.MouseEvent<HTMLDivElement>) => {
    const { tabGroup, tab, selected } = this.props;

    e.stopPropagation();

    const tabIndex = tabGroup.tabs.indexOf(tab);

    if (selected) {
      if (tabIndex + 1 < tabGroup.tabs.length && !tabGroup.tabs[tabIndex + 1].isRemoving) {
        tabGroup.selectedTab = tabGroup.tabs[tabIndex + 1].id;
      } else if (tabIndex - 1 >= 0 && !tabGroup.tabs[tabIndex - 1].isRemoving) {
        tabGroup.selectedTab = tabGroup.tabs[tabIndex - 1].id;
      } else if (Store.tabGroups.length === 1) {
        closeWindow();
      }
    }

    tabGroup.resetTimer();

    tab.isRemoving = true;
    if (tabGroup.tabs.length - 1 === tabIndex) {
      const previousTab = tabGroup.tabs[tabIndex - 1];
      tab.setLeft(previousTab.getNewLeft() + previousTab.getWidth(), true);
      tabGroup.updateTabsBounds();
    }

    tab.setWidth(0, true);

    setTimeout(() => {
      tabGroup.removeTab(tab);
    }, tabAnimations.left.duration * 1000);

    tabGroup.setTabsPositions();

    requestAnimationFrame(() => {
      tabGroup.line.moveToTab(tabGroup.getSelectedTab());
    });
  };

  public render() {
    const { selected, tab, tabGroup } = this.props;

    const {
      title, isRemoving, hovered, dragging, favicon,
    } = tab;
    const { theme } = Store.theme;

    type TabState = 'tab' | 'tabSelected' | 'tabSelectedHovered' | 'tabDragging' | 'tabHovered';

    let tabState: TabState = 'tab';

    if (selected) {
      tabState = 'tabSelected';

      if (hovered && !dragging && theme.tabSelected.enableHover) {
        tabState = 'tabSelectedHovered';
      }

      if (dragging) {
        tabState = 'tabDragging';
      }
    } else if (hovered) {
      tabState = 'tabHovered';
    }

    let rightBorderVisible = true;

    if (
      hovered ||
      ((tabGroup.tabs.indexOf(tab) + 1 !== tabGroup.tabs.length &&
        tabGroup.tabs[tabGroup.tabs.indexOf(tab) + 1].hovered) ||
        tabGroup.tabs.indexOf(tab) === tabGroup.tabs.length - 1)
    ) {
      rightBorderVisible = false;
    }

    return (
      <StyledTab
        selected={selected}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onClick={this.onClick}
        isRemoving={isRemoving}
        visible={!Store.addressBar.toggled}
        innerRef={r => {
          this.tab = r;
          tab.tab = r;
        }}
        style={{ ...(theme[tabState] as any) }}
      >
        <Content
          hovered={hovered}
          tabState={tabState}
          style={{ ...(theme[`${tabState}Content` as TabState] as any) }}
        >
          <Icon
            favicon={favicon.trim()}
            styleToApply={{ ...(theme[`${tabState}Icon` as TabState] as any) }}
          />
          <Title favicon={favicon} style={{ ...(theme[`${tabState}Title` as TabState] as any) }}>
            {title}
          </Title>
        </Content>
        <Close
          onMouseDown={this.onCloseMouseDown}
          onMouseUp={this.onCloseMouseUp}
          onClick={this.onClose}
          hovered={hovered}
          style={{ ...(theme[`${tabState}Close` as TabState] as any) }}
        >
          <Ripples
            icon
            ref={r => (this.iconRipples = r)}
            color="#000"
            parentWidth={16}
            parentHeight={16}
            size={28}
            rippleTime={0.6}
            initialOpacity={0.1}
          />
        </Close>
        {this.props.children}
        <Overlay hovered={hovered} selected={selected} />
        <Ripples
          rippleTime={0.6}
          ref={r => (this.ripples = r)}
          color={
            theme.tab.rippleColor === '' || theme.tab.rippleColor == null
              ? Store.theme.theme.accentColor
              : theme.tab.rippleColor
          }
        />
        <RightBorder visible={rightBorderVisible} />
      </StyledTab>
    );
  }
}
