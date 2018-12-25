import * as React from 'react';
import { observer } from 'mobx-react';
import { observe } from 'mobx';

import store from '~/renderer/app/store';
import {
  TOOLBAR_HEIGHT,
  TAB_ANIMATION_DURATION,
} from '~/renderer/app/constants';
import Tab from '../Tab';

@observer
export default class Tabs extends React.Component {
  public componentDidMount() {
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);

    observe(store.tabsStore.tabs, (change: any) => {
      if (change.addedCount > 0 && change.removedCount === 0) {
        if (store.tabsStore.scrollbarRef) {
          store.tabsStore.scrollbarRef.current.scrollToEnd(
            TAB_ANIMATION_DURATION * 1000,
          );
        }
      }
    });
  }

  public componentWillUnmount() {
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  public onMouseUp = () => {
    const selectedTab = store.tabsStore.selectedTab;

    store.tabsStore.isDragging = false;
    store.tabsStore.setTabsLefts(true);

    if (selectedTab) {
      selectedTab.isDragging = false;
    }
  };

  public onMouseMove = (e: any) => {
    const tabGroup = store.tabGroupsStore.currentGroup;
    if (!tabGroup) return;

    const { selectedTab } = store.tabsStore;

    if (store.tabsStore.isDragging) {
      const container = store.tabsStore.containerRef;
      const {
        tabStartX,
        mouseStartX,
        lastMouseX,
        lastScrollLeft,
      } = store.tabsStore;

      const boundingRect = container.current.getBoundingClientRect();

      if (Math.abs(e.pageX - mouseStartX) < 5) {
        return;
      }

      selectedTab.isDragging = true;

      const newLeft =
        tabStartX +
        e.pageX -
        mouseStartX -
        (lastScrollLeft - container.current.scrollLeft);

      let left = Math.max(0, newLeft);

      if (
        newLeft + selectedTab.width >
        store.addTabStore.left + container.current.scrollLeft
      ) {
        left = store.addTabStore.left - selectedTab.width + lastScrollLeft;
      }

      selectedTab.setLeft(left, false);

      if (
        e.pageY > TOOLBAR_HEIGHT + 16 ||
        e.pageY < -16 ||
        e.pageX < boundingRect.left ||
        e.pageX - boundingRect.left > store.addTabStore.left
      ) {
        // TODO: Create a new window
      }

      store.tabsStore.getTabsToReplace(
        selectedTab,
        lastMouseX - e.pageX >= 1 ? 'left' : 'right',
      );

      store.tabsStore.lastMouseX = e.pageX;
    }
  };

  public render() {
    return (
      <React.Fragment>
        {store.tabsStore.tabs
          .filter(x => x.tabGroupId === store.tabGroupsStore.currentGroupId)
          .map(item => (
            <Tab key={item.id} tab={item} />
          ))}
      </React.Fragment>
    );
  }
}
