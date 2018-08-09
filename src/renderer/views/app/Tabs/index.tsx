import { observer } from 'mobx-react';
import React from 'react';

import { TOOLBAR_HEIGHT } from '../../../../constants';
import {
  getSelectedTab,
  getTabsToReplace,
  moveIndicatorToSelectedTab,
  setTabLeft,
  setTabsLefts,
} from '../../../../utils';
import store from '../../../store';
import Tab from '../Tab';

@observer
export default class Tabs extends React.Component {
  public componentDidMount() {
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  public componentWillUnmount() {
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  public onMouseUp = () => {
    const selectedTab = getSelectedTab();

    store.tabDragData.dragging = false;
    setTabsLefts(true);
    moveIndicatorToSelectedTab(true);

    store.isTabDragged = false;

    if (selectedTab) {
      selectedTab.isDragging = false;
    }
  }

  public onMouseMove = (e: any) => {
    const selectedTab = getSelectedTab();
    const { tabDragData } = store;

    if (tabDragData.dragging) {
      const { tabStartX, mouseStartX, lastMouseX } = tabDragData;
      const { tabbarRef } = store;
      const { lastTabbarScrollLeft } = store;

      const boundingRect = tabbarRef.getBoundingClientRect();

      if (Math.abs(e.pageX - mouseStartX) < 5) {
        return;
      }

      selectedTab.isDragging = true;
      store.addressBar.canToggle = false;

      const newLeft =
        tabStartX +
        e.pageX -
        mouseStartX -
        (lastTabbarScrollLeft - tabbarRef.scrollLeft);

      let left = newLeft;

      if (newLeft < 0) {
        left = 0;
      } else if (
        newLeft + selectedTab.width >
        store.addTabLeft + tabbarRef.scrollLeft
      ) {
        left = store.addTabLeft - selectedTab.width;
      }

      setTabLeft(selectedTab, left, false);

      if (
        e.pageY > TOOLBAR_HEIGHT + 16 ||
        e.pageY < -16 ||
        e.pageX < boundingRect.left ||
        e.pageX - boundingRect.left > store.addTabLeft
      ) {
        // TODO: Create a new window
      }

      moveIndicatorToSelectedTab(false);
      // TweenLite.to(workspace.tabsIndicator, 0, { left: selectedTab.left });

      let direction = '';
      if (lastMouseX - e.pageX >= 1) {
        direction = 'left';
      } else if (lastMouseX - e.pageX <= -1) {
        direction = 'right';
      }

      if (direction !== '') {
        tabDragData.direction = direction;
      }

      getTabsToReplace(selectedTab, tabDragData.direction);

      tabDragData.lastMouseX = e.pageX;
    }
  }

  public render() {
    return (
      <React.Fragment>
        {store.tabs.map(tab => (
          <Tab key={tab.id} tab={tab} />
        ))}
      </React.Fragment>
    );
  }
}
