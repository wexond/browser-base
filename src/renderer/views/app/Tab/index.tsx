import { observer } from 'mobx-react';
import React from 'react';

import store from '../../../store';
import Ripples from '../../../components/Ripples';
import components from '../../../components';
import Preloader from '../../../components/Preloader';
import { Tab } from '../../../../models';
import { emitEvent, closeWindow } from '../../../../utils';
import { tabAnimations, colors } from '../../../../defaults';

export interface TabProps {
  key: number;
  tab: Tab;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTabMouseDown?: (e?: React.MouseEvent<HTMLDivElement>, tab?: Tab) => void;
  style?: any;
}

@observer
export default class TabComponent extends React.Component<TabProps, {}> {
  private ripples: Ripples;

  private iconRipples: Ripples;

  private tab: HTMLDivElement;

  public componentDidMount() {
    const { tab } = this.props;

    const frame = () => {
      if (this.tab != null) {
        const boundingRect = this.tab.getBoundingClientRect();
        if (
          store.mouse.x >= boundingRect.left
          && store.mouse.x <= boundingRect.left + this.tab.offsetWidth
          && store.mouse.y >= boundingRect.top
          && store.mouse.y <= boundingRect.top + this.tab.offsetHeight
        ) {
          if (!tab.hovered && !store.isTabDragged) {
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
    const { tab, onTabMouseDown } = this.props;
    const { workspace } = tab;
    const { pageX, pageY } = e;

    const selected = tab.workspace.selectedTab === tab.id;

    store.addressBar.canToggle = selected;
    setTimeout(() => {
      if (tab !== workspace.getSelectedTab()) {
        workspace.selectTab(tab);
      }
    });
    onTabMouseDown(e, tab);
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
    if (store.addressBar.canToggle) {
      store.addressBar.toggled = true;
    }
  };

  public onClose = (e: React.MouseEvent<HTMLDivElement>) => {
    const { tab } = this.props;
    const { workspace } = tab;
    const selected = workspace.selectedTab === tab.id;

    e.stopPropagation();

    const tabIndex = workspace.tabs.indexOf(tab);
    const page = store.getPageById(tab.id);

    store.pages.splice(store.pages.indexOf(page), 1);

    if (selected) {
      if (tabIndex + 1 < workspace.tabs.length && !workspace.tabs[tabIndex + 1].isRemoving) {
        workspace.selectedTab = workspace.tabs[tabIndex + 1].id;
      } else if (tabIndex - 1 >= 0 && !workspace.tabs[tabIndex - 1].isRemoving) {
        workspace.selectedTab = workspace.tabs[tabIndex - 1].id;
      } else if (store.workspaces.length === 1) {
        emitEvent('tabs', 'onRemoved', tab.id, {
          windowId: 0,
          isWindowClosing: true,
        });
        closeWindow();
      }
    }

    emitEvent('tabs', 'onRemoved', tab.id, {
      windowId: 0,
      isWindowClosing: true,
    });

    workspace.resetTimer();

    tab.isRemoving = true;
    if (workspace.tabs.length - 1 === tabIndex) {
      const previousTab = workspace.tabs[tabIndex - 1];
      tab.setLeft(previousTab.getNewLeft() + previousTab.getWidth(), true);
      workspace.updateTabsBounds();
    }

    tab.setWidth(0, true);

    setTimeout(() => {
      workspace.removeTab(tab);
    }, tabAnimations.left.duration * 1000);

    workspace.setTabsPositions();

    requestAnimationFrame(() => {
      workspace.tabsIndicator.moveToTab(workspace.getSelectedTab());
    });
  };

  public render() {
    const { tab, children } = this.props;
    const { workspace } = tab;
    const selected = workspace.selectedTab === tab.id;

    const {
      title, isRemoving, hovered, dragging, favicon, loading,
    } = tab;

    let rightBorderVisible = true;

    const tabIndex = workspace.tabs.indexOf(tab);

    if (
      hovered
      || selected
      || ((tabIndex + 1 !== workspace.tabs.length
        && (workspace.tabs[tabIndex + 1].hovered
          || workspace.selectedTab === workspace.tabs[tabIndex + 1].id))
        || tabIndex === workspace.tabs.length - 1)
    ) {
      rightBorderVisible = false;
    }

    const {
      Root, Content, Icon, Title, Close, Overlay, RightBorder,
    } = components.tab;

    return (
      <Root
        selected={selected}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onClick={this.onClick}
        isRemoving={isRemoving}
        visible={!store.addressBar.toggled}
        innerRef={(r: HTMLDivElement) => {
          this.tab = r;
          tab.tab = r;
        }}
      >
        <Content hovered={hovered}>
          {!loading && <Icon favicon={favicon.trim()} />}
          {loading && <Preloader thickness={6} size={16} />}
          <Title selected={selected} loading={loading} favicon={favicon}>
            {title}
          </Title>
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
        {children}
        <Overlay hovered={hovered} selected={selected} />
        <Ripples rippleTime={0.6} ref={r => (this.ripples = r)} color={colors.blue['500']} />
        <RightBorder visible={rightBorderVisible} />
      </Root>
    );
  }
}
