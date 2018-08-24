import { observer } from 'mobx-react';
import React from 'react';

import { AddTab, StyledTabbar, TabsContainer } from './styles';
import HorizontalScrollbar from '../HorizontalScrollbar';
import store from '@app/store';
import { icons } from '~/renderer/defaults';
import TabGroups from '../TabGroups';

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
    return store.tabsStore.containerRef;
  };

  public onMouseEnter = () => {
    store.tabsStore.scrollbarVisible = true;
  };

  public onMouseLeave = () => {
    store.tabsStore.scrollbarVisible = false;
  };

  public render() {
    return (
      <StyledTabbar visible={!store.addressBarStore.toggled}>
        <TabsContainer
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          innerRef={r => (store.tabsStore.containerRef = r)}
        >
          <TabGroups />
        </TabsContainer>
        <HorizontalScrollbar
          ref={r => (store.tabsStore.scrollbarRef = r)}
          visible={store.tabsStore.scrollbarVisible}
          getContainer={this.getContainer}
        />
        <AddTab
          icon={icons.add}
          onClick={this.onAddTabClick}
          divRef={r => (store.addTabStore.ref = r)}
        />
      </StyledTabbar>
    );
  }
}
