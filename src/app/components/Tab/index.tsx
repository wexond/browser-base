import { observer } from 'mobx-react'; // eslint-disable-line no-unused-vars
import React from 'react';
import { Ripples } from 'nersent-ui';

// Constants and defaults
import tabAnimations from '../../defaults/tab-animations';

// Utils
import { closeWindow } from '../../utils/window';

// Styles
import { Close, StyledTab, Title, Icon, Content, Overlay } from './styles';

// Models
import Tab from '../../models/tab';
import TabGroup from '../../models/tab-group';

import Store from '../../store';

interface Props {
  key: number;
  tab: Tab;
  tabGroup: TabGroup;
  selected: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  styles?: any;
}

@observer
export default class extends React.Component<Props, {}> {
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

    this.ripples.makeRipple(e.pageX, e.pageY);
    Store.addressBar.canToggle = selected;
    tabGroup.selectTab(tab);

    this.props.onMouseDown(e);
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
    const {
      title, isRemoving, hovered, dragging,
    } = tab;

    return (
      <StyledTab
        selected={selected}
        hovered={hovered}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onClick={this.onClick}
        isRemoving={isRemoving}
        dragging={dragging}
        visible={!Store.addressBar.toggled}
        innerRef={(r) => {
          this.tab = r;
          tab.tab = r;
        }}
      >
        <Content hovered={hovered}>
          <Icon />
          <Title>{title}</Title>
        </Content>

        <Close
          onMouseDown={this.onCloseMouseDown}
          onMouseUp={this.onCloseMouseUp}
          onClick={this.onClose}
          hovered={hovered}
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
        <Overlay hovered={hovered} selected={selected} />
        <Ripples
          rippleTime={0.6}
          ref={r => (this.ripples = r)}
          color={
            Store.theme.tabs.rippleColor === ''
              ? Store.theme.accentColor
              : Store.theme.tabs.rippleColor
          }
        />
      </StyledTab>
    );
  }
}
