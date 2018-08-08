import { observer } from 'mobx-React';
import React from 'react';

import { Tab } from '../../../../models';
import {
  closeWindow,
  getCurrentWorkspace,
  getPageById,
  getTabLeft,
  getTabNewLeft,
  getTabWidth,
  getWorkspaceById,
  getWorkspaceTabs,
  moveIndicatorToSelectedTab,
  removeTab,
  selectTab,
  setTabLeft,
  setTabsLefts,
  setTabWidth,
  updateTabsBounds,
} from '../../../../utils';
import store from '../../../store';
import { Close, StyledTab } from './styles';

@observer
export default class TabComponent extends React.Component<{ tab: Tab }, {}> {
  public componentDidMount() {
    const { tab } = this.props;

    setTabLeft(tab, getTabLeft(tab), false);
    updateTabsBounds(true);
  }

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { tab } = this.props;
    selectTab(tab);

    store.tabDragData = {
      lastMouseX: 0,
      dragging: true,
      mouseStartX: e.pageX,
      tabStartX: tab.left,
      direction: '',
    };

    store.isTabDragged = true;

    store.lastTabbarScrollLeft = store.tabbarRef.scrollLeft;
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

    const notClosingTabs = workspaceTabs.filter((x) => !x.isClosing);
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

      if (index + 1 < workspaceTabs.length && !workspaceTabs[index + 1].isClosing) {
        selectTab(workspaceTabs[index + 1]);
      } else if (index - 1 >= 0 && !workspaceTabs[index - 1].isClosing) {
        selectTab(workspaceTabs[index - 1]);
      } else if (store.workspaces.length === 1) {
        console.log('aha');
        // closeWindow();
      }
    } else {
      moveIndicatorToSelectedTab(true);
    }

    setTimeout(() => {
      removeTab(tab.id);
    },         300);
  }

  public render() {
    const { tab } = this.props;
    const currentWorkspace = getCurrentWorkspace();

    return (
      <StyledTab
        visible={currentWorkspace.id === tab.workspaceId}
        onMouseDown={this.onMouseDown}
        innerRef={(r) => (tab.ref = r)}
      >
        <Close onMouseDown={this.onCloseMouseDown} onClick={this.onCloseClick} />
      </StyledTab>
    );
  }
}
