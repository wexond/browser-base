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
  private scrollbar: HorizontalScrollbar;

  public componentDidMount() {
    observe(store.tabsStore.groups, (change: any) => {
      console.log(change);
      /*
        TODO:
        if (change.addedCount > 0 && change.removedCount === 0) {
        if (this.scrollbar) {
          this.scrollbar.scrollToEnd(TAB_ANIMATION_DURATION * 1000);
        }
      }*/
    });

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
          ref={r => (this.scrollbar = r)}
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
