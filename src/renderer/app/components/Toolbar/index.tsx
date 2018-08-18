import { observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';

import AddressBar from '../AddressBar';
import BookmarksDialog from '../BookmarksDialog';
import NavigationButtons from '../NavigationButtons';
import TabBar from '../TabBar';
import { Handle, Line, StyledToolbar, TabsSection } from './styles';
import ToolbarButton from '../ToolbarButton';
import ToolbarSeparator from '../ToolbarSeparator';
import store from 'app-store';
import { Bookmark } from 'interfaces';
import { icons } from 'defaults';
import { Platforms } from 'enums';
import WindowsControls from '../WindowsButtons';

@observer
export default class Toolbar extends React.Component {
  public static Button = ToolbarButton;
  public static Separator = ToolbarSeparator;

  public onWorkspacesIconClick = () => {
    store.tabsStore.menuVisible = true;
  };

  public toggleMenu = () => {
    store.menuStore.visible = !store.menuStore.visible;
  };

  public onStarIconMouseDown = (e: SyntheticEvent<any>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  public onStarIconClick = async () => {
    const selectedTab = store.tabsStore.getSelectedTab();

    let bookmark: Bookmark = store.bookmarksStore.bookmarks.find(
      x => x.url === selectedTab.url,
    );

    if (!bookmark) {
      bookmark = await store.bookmarksStore.addBookmark({
        title: selectedTab.title,
        url: selectedTab.url,
        parent: null,
        type: 'item',
        favicon: selectedTab.favicon,
      });
    }

    store.bookmarksStore.dialogRef.show(bookmark);
  };

  public render() {
    const selectedTab = store.tabsStore.getSelectedTab();

    return (
      <StyledToolbar isHTMLFullscreen={store.isHTMLFullscreen}>
        <Handle />
        <NavigationButtons />
        <ToolbarSeparator style={{ marginRight: 16 }} />
        <TabsSection>
          <AddressBar visible={store.addressBarStore.toggled} />
          <TabBar />
        </TabsSection>
        <ToolbarSeparator style={{ marginLeft: 16 }} />
        <div style={{ position: 'relative' }}>
          <ToolbarButton
            size={20}
            icon={selectedTab.isBookmarked ? icons.star : icons.starBorder}
            onMouseDown={this.onStarIconMouseDown}
            onClick={this.onStarIconClick}
          />
          <BookmarksDialog ref={r => (store.bookmarksStore.dialogRef = r)} />
        </div>
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
        <Line />
      </StyledToolbar>
    );
  }
}
