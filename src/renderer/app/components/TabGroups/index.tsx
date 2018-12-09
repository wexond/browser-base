import * as React from 'react';
import { observer } from 'mobx-react';

import store from '@app/store';
import TabGroup from '../TabGroup';
import { TOOLBAR_HEIGHT } from '@/constants/app';

@observer
export default class TabGroups extends React.Component {
  public componentDidMount() {
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  public componentWillUnmount() {
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  public onMouseUp = () => {
    const selectedTab = store.tabsStore.getSelectedTab();

    store.tabsStore.isDragging = false;
    store.tabsStore.getCurrentGroup().setTabsLefts(true);

    if (selectedTab) {
      selectedTab.isDragging = false;
    }
  };

  public onMouseMove = (e: any) => {
    const tabGroup = store.tabsStore.getCurrentGroup();
    if (!tabGroup) return;

    const selectedTab = tabGroup.getSelectedTab();

    if (store.tabsStore.isDragging) {
      const container = store.tabsStore.containerRef;
      const {
        tabStartX,
        mouseStartX,
        lastMouseX,
        lastScrollLeft,
      } = store.tabsStore;

      const boundingRect = container.getBoundingClientRect();

      if (Math.abs(e.pageX - mouseStartX) < 5) {
        return;
      }

      selectedTab.isDragging = true;
      store.addressBarStore.canToggle = false;

      const newLeft =
        tabStartX +
        e.pageX -
        mouseStartX -
        (lastScrollLeft - container.scrollLeft);

      let left = Math.max(0, newLeft);

      if (
        newLeft + selectedTab.width >
        store.addTabStore.left + container.scrollLeft
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

      tabGroup.getTabsToReplace(
        selectedTab,
        lastMouseX - e.pageX >= 1 ? 'left' : 'right',
      );

      store.tabsStore.lastMouseX = e.pageX;
    }
  };

  public render() {
    return (
      <React.Fragment>
        {store.tabsStore.groups.map(item => (
          <TabGroup tabGroup={item} key={item.id} />
        ))}
      </React.Fragment>
    );
  }
}
