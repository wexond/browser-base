import { observer } from 'mobx-react';
import * as React from 'react';

import HorizontalScrollbar from '../HorizontalScrollbar';
import store from '~/renderer/app/store';
import { icons } from '~/renderer/app/constants/icons';
import TabGroups from '../TabGroups';
import { AddTab, StyledTabbar, TabsContainer } from './style';

@observer
export default class Tabbar extends React.Component {
  public componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  public onResize = (e: Event) => {
    if (e.isTrusted) {
      store.tabsStore.getCurrentGroup().updateTabsBounds(false);
    }
  };

  public onAddTabClick = () => {
    store.tabsStore.addTab();
  };

  public getContainer = () => {
    return store.tabsStore.containerRef.current;
  };

  public onMouseEnter = () => {
    store.tabsStore.scrollbarVisible = true;
  };

  public onMouseLeave = () => {
    store.tabsStore.scrollbarVisible = false;
  };

  public render() {
    return (
      <StyledTabbar>
        <TabsContainer
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          ref={store.tabsStore.containerRef}
        >
          <TabGroups />
        </TabsContainer>
        <HorizontalScrollbar
          ref={store.tabsStore.scrollbarRef}
          visible={store.tabsStore.scrollbarVisible}
          getContainer={this.getContainer}
        />
        <AddTab
          icon={icons.add}
          onClick={this.onAddTabClick}
          divRef={(r: HTMLDivElement) => (store.addTabStore.ref = r)}
        />
      </StyledTabbar>
    );
  }
}
