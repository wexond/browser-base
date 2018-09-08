import { observer } from 'mobx-react';
import React from 'react';

import Menu from '../Menu';
import AddressBar from '../AddressBar';
import NavigationButtons from '../NavigationButtons';
import TabBar from '../TabBar';
import ToolbarButton from '../ToolbarButton';
import ToolbarSeparator from '../ToolbarSeparator';
import store from '@app/store';
import { Platforms } from '@/enums';
import WindowsControls from '../WindowsButtons';
import BookmarkButton from '@app/components/BookmarkButton';
import { icons } from '@/constants/renderer';
import BrowserAction from '@app/components/BrowserAction';
import { StyledToolbar, TabsSection, Tabs, Section } from './styles';
import BookmarksBar from '@app/components/BookmarksBar';

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
class BrowserActions extends React.Component {
  public render() {
    const { selectedTab } = store.tabsStore;

    return (
      <React.Fragment>
        {selectedTab &&
          store.extensionsStore.browserActions.map(item => {
            if (item.tabId === selectedTab) {
              return (
                <BrowserAction browserAction={item} key={item.extensionId} />
              );
            }
            return null;
          })}
      </React.Fragment>
    );
  }
}

@observer
export default class Toolbar extends React.Component {
  public onWorkspacesIconClick = () => {
    store.tabsStore.menuVisible = true;
  };

  public onMenuIconClick = () => {
    store.menuStore.visible = !store.menuStore.visible;
  };

  public onMenuIconMouseDown = (e: React.MouseEvent<any>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  public render() {
    return (
      <StyledToolbar isHTMLFullscreen={store.isHTMLFullscreen}>
        <Section>
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
          <ToolbarSeparator />
          <BrowserActions />
          <ToolbarButton
            onClick={this.onMenuIconClick}
            onMouseDown={this.onMenuIconMouseDown}
            size={20}
            icon={icons.menu}
            style={{ marginRight: 4 }}
          >
            <Menu />
          </ToolbarButton>
          {store.platform !== Platforms.MacOS && <WindowsControls />}
        </Section>
        <BookmarksBar />
      </StyledToolbar>
    );
  }
}
