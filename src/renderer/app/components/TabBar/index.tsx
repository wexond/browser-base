import { observer } from 'mobx-react';
import React from 'react';
import { observe } from 'mobx';

import { AddTab, StyledTabbar, TabsContainer } from './styles';
import HorizontalScrollbar from '../HorizontalScrollbar';
import store from '@app/store';
import { TAB_ANIMATION_DURATION } from '~/constants';
import { icons } from '~/defaults';
import TabGroups from '../TabGroups';

@observer
export default class Tabbar extends React.Component {
  private tabsContainer: HTMLDivElement;

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
    return this.tabsContainer;
  };

  public onMouseEnter = () => {
    store.tabbarStore.scrollbarVisible = true;
  };

  public onMouseLeave = () => {
    store.tabbarStore.scrollbarVisible = false;
  };

  public render() {
    return (
      <StyledTabbar
        visible={!store.addressBarStore.toggled}
        innerRef={r => (store.tabbarStore.ref = r)}
      >
        <TabsContainer
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          innerRef={r => (this.tabsContainer = r)}
        >
          <TabGroups />
        </TabsContainer>
        <HorizontalScrollbar
          ref={r => (store.tabbarStore.scrollbarRef = r)}
          visible={store.tabbarStore.scrollbarVisible}
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
