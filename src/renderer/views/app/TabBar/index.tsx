import { observer } from 'mobx-react';
import React from 'react';
import { observe } from 'mobx';

import { createTab, getTabWidth, updateTabsBounds } from '../../../../utils';
import store from '../../../store';
import Tabs from '../Tabs';
import { AddTab, StyledTabbar, TabsContainer } from './styles';
import { icons, tabAnimations } from '../../../../defaults';
import HorizontalScrollbar from '../HorizontalScrollbar';
import { Tab } from '../../../../models';

@observer
export default class Tabbar extends React.Component {
  private tabsContainer: HTMLDivElement;
  private scrollbar: HorizontalScrollbar;

  public componentDidMount() {
    observe(store.tabs, (change: any) => {
      if (change.addedCount > 0 && change.removedCount === 0) {
        const tab = change.added[0] as Tab;

        requestAnimationFrame(() => {
          if (this.scrollbar) {
            this.scrollbar.scrollToEnd(
              getTabWidth(),
              tabAnimations.width.duration * 1000,
            );
          }
        });
      }
    });

    window.addEventListener('resize', this.onResize);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  public onResize = (e: Event) => {
    if (e.isTrusted) {
      updateTabsBounds(false);
    }
  }

  public onAddTabClick = () => {
    createTab();
  }

  public getContainer = () => {
    return this.tabsContainer;
  }

  public onMouseEnter = () => {
    store.tabbarScrollbarVisible = true;
  }

  public onMouseLeave = () => {
    store.tabbarScrollbarVisible = false;
  }

  public render() {
    return (
      <StyledTabbar
        visible={!store.addressBar.toggled}
        innerRef={r => (store.tabbarRef = r)}
      >
        <TabsContainer
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          innerRef={r => (this.tabsContainer = r)}
        >
          <Tabs />
        </TabsContainer>
        <HorizontalScrollbar
          ref={r => (this.scrollbar = r)}
          visible={store.tabbarScrollbarVisible}
          getContainer={this.getContainer}
        />
        <AddTab
          icon={icons.add}
          onClick={this.onAddTabClick}
          divRef={r => (store.addTabRef = r)}
        />
      </StyledTabbar>
    );
  }
}
