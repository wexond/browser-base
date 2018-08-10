import { observer } from 'mobx-react';
import React from 'react';

import { Tab } from '../../../../models';
import {
  closeWindow,
  getPageById,
  getTabLeft,
  getTabNewLeft,
  getTabWidth,
  getWorkspaceById,
  getWorkspaceTabs,
  removeTab,
  selectTab,
  setTabLeft,
  setTabsLefts,
  setTabWidth,
  updateTabsBounds,
  emitEvent,
} from '../../../../utils';
import store from '../../../store';
import { colors, tabAnimations } from '../../../../defaults';
import components from '../../../components';
import Preloader from '../../../components/Preloader';
import Ripple from '../../../components/Ripple';
import { Circle } from './styles';

@observer
export default class TabComponent extends React.Component<{ tab: Tab }, {}> {
  private ripple: Ripple;

  public componentDidMount() {
    const { tab } = this.props;

    setTabLeft(tab, getTabLeft(tab), false);
    updateTabsBounds(true);

    const frame = () => {
      if (tab.ref != null) {
        const boundingRect = tab.ref.getBoundingClientRect();
        if (
          store.mouse.x >= boundingRect.left &&
          store.mouse.x <= boundingRect.left + tab.ref.offsetWidth &&
          store.mouse.y >= boundingRect.top &&
          store.mouse.y <= boundingRect.top + tab.ref.offsetHeight
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
    const { pageX, pageY } = e;
    const { tab } = this.props;

    const workspace = getWorkspaceById(tab.workspaceId);
    const selected = workspace.selectedTab === tab.id;

    store.addressBar.canToggle = selected;

    selectTab(tab);

    store.tabDragData = {
      lastMouseX: 0,
      dragging: true,
      mouseStartX: pageX,
      tabStartX: tab.left,
      direction: '',
    };

    store.isTabDragged = true;

    store.lastTabbarScrollLeft = store.tabbarRef.scrollLeft;

    this.ripple.makeRipple(pageX, pageY);
  }

  public onCloseMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }

  public onCloseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { tab } = this.props;
    const workspace = getWorkspaceById(tab.workspaceId);
    const selected = workspace.selectedTab === tab.id;
    const workspaceTabs = getWorkspaceTabs(workspace.id);

    e.stopPropagation();

    store.pages.splice(store.pages.indexOf(getPageById(tab.id)), 1);

    store.resetRearrangeTabsTimer();

    const notClosingTabs = workspaceTabs.filter(x => !x.isClosing);
    let index = notClosingTabs.indexOf(tab);

    tab.isClosing = true;
    if (notClosingTabs.length - 1 === index) {
      const previousTab = workspaceTabs[index - 1];
      setTabLeft(tab, getTabNewLeft(previousTab) + getTabWidth(), true);
      updateTabsBounds();
    }

    setTabWidth(tab, 0, true);
    setTabsLefts(true);

    if (selected) {
      index = workspaceTabs.indexOf(tab);

      if (
        index + 1 < workspaceTabs.length &&
        !workspaceTabs[index + 1].isClosing
      ) {
        const nextTab = workspaceTabs[index + 1];
        if (nextTab.isNew) {
          store.addressBar.toggled = true;
        }
        selectTab(nextTab);
      } else if (index - 1 >= 0 && !workspaceTabs[index - 1].isClosing) {
        const prevTab = workspaceTabs[index - 1];
        if (prevTab.isNew) {
          store.addressBar.toggled = true;
        }
        selectTab(prevTab);
      } else if (store.workspaces.length === 1) {
        closeWindow();
      }
    }

    setTimeout(() => {
      removeTab(tab.id);
    }, tabAnimations.width.duration * 1000);

    emitEvent('tabs', 'onRemoved', tab.id, {
      windowId: 0,
      isWindowClosing: true,
    });
  }

  public onClick = () => {
    const { tab } = this.props;
    if (store.addressBar.canToggle) {
      store.addressBar.toggled = true;
    }

    if (tab.isNew) {
      store.addressBar.toggled = true;
    }
  }

  public render() {
    const { tab, children } = this.props;
    const {
      title,
      isClosing,
      hovered,
      isDragging,
      favicon,
      loading,
      workspaceId,
    } = tab;
    const workspace = getWorkspaceById(workspaceId);
    const tabs = getWorkspaceTabs(workspace.id);

    const selected = workspace.selectedTab === tab.id;

    let rightBorderVisible = true;

    const tabIndex = tabs.indexOf(tab);

    if (
      hovered ||
      selected ||
      ((tabIndex + 1 !== tabs.length &&
        (tabs[tabIndex + 1].hovered ||
          workspace.selectedTab === tabs[tabIndex + 1].id)) ||
        tabIndex === tabs.length - 1)
    ) {
      rightBorderVisible = false;
    }

    const {
      Root,
      Content,
      Icon,
      Title,
      Close,
      Overlay,
      RightBorder,
    } = components.tab;

    return (
      <Root
        selected={selected}
        onMouseDown={this.onMouseDown}
        onClick={this.onClick}
        isRemoving={isClosing}
        workspaceSelected={store.currentWorkspace === workspaceId}
        visible={!store.addressBar.toggled}
        innerRef={(r: HTMLDivElement) => (tab.ref = r)}
      >
        <Content hovered={hovered} selected={selected}>
          {!loading && <Icon favicon={favicon.trim()} />}
          {loading && <Preloader thickness={6} size={16} />}
          <Title selected={selected} loading={loading} favicon={favicon}>
            {title}
          </Title>
        </Content>
        <Close
          onMouseDown={this.onCloseMouseDown}
          onClick={this.onCloseClick}
          hovered={hovered}
          selected={selected}
        >
          <Circle />
        </Close>
        {children}
        <Overlay hovered={hovered} selected={selected} />
        <Ripple
          rippleTime={0.6}
          ref={r => (this.ripple = r)}
          opacity={0.15}
          color={colors.blue['500']}
        />
        <RightBorder visible={rightBorderVisible} />
      </Root>
    );
  }
}
