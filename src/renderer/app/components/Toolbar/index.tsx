import { observer } from 'mobx-react';
import React from 'react';

import AddressBar from '../AddressBar';
import NavigationButtons from '../NavigationButtons';
import TabBar from '../TabBar';
import { StyledToolbar, TabsSection, Tabs } from './styles';
import ToolbarButton from '../ToolbarButton';
import ToolbarSeparator from '../ToolbarSeparator';
import store from '@app/store';
import { icons } from '~/defaults';
import { Platforms } from '~/enums';
import WindowsControls from '../WindowsButtons';
import BookmarkButton from '@app/components/BookmarkButton';

@observer
class FirstSeparator extends React.Component {
  public render() {
    const { toggled } = store.addressBarStore;
    const tabGroup = store.tabsStore.getCurrentGroup();

    let separatorVisible = true;
    // Check if the first tab is hovered or selected
    if (tabGroup && tabGroup.tabs.length > 0) {
      if (
        tabGroup.tabs[0].id === tabGroup.selectedTab ||
        tabGroup.tabs[0].hovered
      ) {
        separatorVisible = false;
      }
    }

    return (
      <ToolbarSeparator
        style={{
          marginRight: 0,
          visibility: separatorVisible && !toggled ? 'visible' : 'hidden',
        }}
      />
    );
  }
}

@observer
class SecondSeparator extends React.Component {
  public render() {
    const { toggled } = store.addressBarStore;
    return (
      <ToolbarSeparator
        style={{
          visibility: toggled ? 'hidden' : 'visible',
        }}
      />
    );
  }
}

@observer
export default class Toolbar extends React.Component {
  public onWorkspacesIconClick = () => {
    store.tabsStore.menuVisible = true;
  };

  public toggleMenu = () => {
    store.menuStore.visible = !store.menuStore.visible;
  };

  public render() {
    return (
      <StyledToolbar isHTMLFullscreen={store.isHTMLFullscreen}>
        <NavigationButtons />
        <FirstSeparator />
        <TabsSection>
          <AddressBar />
          <Tabs>
            <TabBar />
          </Tabs>
        </TabsSection>
        <SecondSeparator />
        <BookmarkButton />
        <ToolbarButton
          size={16}
          icon={icons.workspaces}
          onClick={this.onWorkspacesIconClick}
        />
        <ToolbarButton
          onClick={this.toggleMenu}
          size={20}
          icon={icons.menu}
          style={{ marginRight: 4 }}
        />
        {store.platform !== Platforms.MacOS && <WindowsControls />}
      </StyledToolbar>
    );
  }
}
