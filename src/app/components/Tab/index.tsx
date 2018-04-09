import { observer } from 'mobx-react';
import { Ripples } from 'nersent-ui';
import React from 'react';
import { Close, Content, Icon, Overlay, StyledTab, Title } from './styles';
import tabAnimations from '../../defaults/tab-animations';
import Tab from '../../models/tab';
import TabGroup from '../../models/tab-group';
import Store from '../../store';
import { closeWindow } from '../../utils/window';

export interface TabProps {
  key: number;
  tab: Tab;
  tabGroup: TabGroup;
  selected: boolean;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTabMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
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

  public shouldComponentUpdate(nextProps: any) {
    const { tab, selected } = this.props;

    if (
      nextProps.tab.left !== tab.left ||
      nextProps.tab.width !== tab.width ||
      selected !== nextProps.selected
    ) {
      return true;
    }
    return false;
  }

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { selected, tab, tabGroup } = this.props;
    const { pageX, pageY } = e;

    Store.addressBar.canToggle = selected;
    setTimeout(() => {
      tabGroup.selectTab(tab);
    });
    this.ripples.makeRipple(pageX, pageY);

    this.props.onTabMouseDown(e);
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

    tab.isRemoving = true;
    if (tabGroup.tabs.length - 1 === tabIndex) {
      const previousTab = tabGroup.tabs[tabIndex - 1];
      tab.setLeft(previousTab.getNewLeft() + previousTab.getWidth(), true);
    }

    tab.setWidth(0, true);

    setTimeout(() => {
      tabGroup.removeTab(tab);
    }, tabAnimations.left.duration * 1000);

    tabGroup.updateTabsBounds();

    requestAnimationFrame(() => {
      tabGroup.line.moveToTab(tabGroup.getSelectedTab());
    });
  };

  public render() {
    const { selected, tab } = this.props;
    let { style } = this.props;

    const {
      title, isRemoving, hovered, dragging, favicon,
    } = tab;
    const { tabs } = Store.theme.theme;

    let tabState: any = { ...tabs.normal };

    if (selected) {
      tabState = { ...tabs.selected };

      if (hovered && !dragging && tabs.enableHoverOnSelectedTab) {
        tabState = { ...tabs.hovered };
      }

      if (dragging) {
        tabState = { ...tabs.dragging };
      }
    } else if (hovered) {
      tabState = { ...tabs.hovered };
    }

    style = { ...style, ...tabState.style };

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
        style={style}
      >
        <Content tabState={tabs.normal} hovered={hovered} style={{ ...tabState.content.style }}>
          <Icon favicon={favicon.trim()} styleToApply={{ ...tabState.icon.style }} />
          <Title favicon={favicon} style={{ ...tabState.title.style }}>
            {title}
          </Title>
        </Content>

        <Close
          onMouseDown={this.onCloseMouseDown}
          onMouseUp={this.onCloseMouseUp}
          onClick={this.onClose}
          hovered={hovered}
          tabState={tabs.normal}
          style={{ ...tabState.close.style }}
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
            tabs.rippleColor === '' || tabs.rippleColor == null
              ? Store.theme.theme.accentColor
              : tabs.rippleColor
          }
        />
      </StyledTab>
    );
  }
}
