import React from 'react';
import store from '@app/store';
import TabGroup from '../TabGroup';
import { TOOLBAR_HEIGHT } from '~/constants';
import { observer } from 'mobx-react';

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
    const selectedTab = tabGroup.getSelectedTab();

    if (store.tabsStore.isDragging) {
      const { tabStartX, mouseStartX, lastMouseX } = store.tabsStore;
      const { lastScrollLeft } = store.tabbarStore;
      const tabbarRef = store.tabbarStore.ref;

      const boundingRect = tabbarRef.getBoundingClientRect();

      if (Math.abs(e.pageX - mouseStartX) < 5) {
        return;
      }

      selectedTab.isDragging = true;
      store.addressBarStore.canToggle = false;

      const newLeft =
        tabStartX +
        e.pageX -
        mouseStartX -
        (lastScrollLeft - tabbarRef.scrollLeft);

      let left = newLeft;

      if (newLeft < 0) {
        left = 0;
      } else if (
        newLeft + selectedTab.width >
        store.addTabStore.left + tabbarRef.scrollLeft
      ) {
        left = store.addTabStore.left - selectedTab.width;
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

      let direction: 'left' | 'right' | '' = '';
      if (lastMouseX - e.pageX >= 1) {
        direction = 'left';
      } else if (lastMouseX - e.pageX <= -1) {
        direction = 'right';
      }

      if (direction !== '') {
        store.tabsStore.dragDirection = direction;
      }

      tabGroup.getTabsToReplace(selectedTab, store.tabsStore.dragDirection);

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
