import React, { SyntheticEvent } from 'react';
import { observer } from 'mobx-react';

import NavigationButtons from '../NavigationButtons';
import ToolbarSeparator from './Separator';
import {
  StyledToolbar, Handle, TabsSection, Line,
} from './styles';
import AddressBar from '../AddressBar';
import TabBar from '../TabBar';
import ToolbarButton from './Button';
import BookmarksDialog from '../BookmarksDialog';
import WindowsControls from '../WindowsControls';
import store from '../../../store';
import BookmarkItem from '../../../models/bookmark-item';
import { addBookmark } from '../../../utils/bookmarks';
import { Platforms } from '../../../enums';

@observer
export default class Toolbar extends React.Component {
  public static Button = ToolbarButton;

  public static Separator = ToolbarSeparator;

  public onWorkspacesIconClick = () => {
    store.workspacesMenuVisible = true;
  };

  public toggleMenu = () => {
    store.menu.visible = !store.menu.visible;
  };

  public onStarIconMouseDown = (e: SyntheticEvent<any>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  public onStarIconClick = async () => {
    const selectedTab = store.getSelectedTab();

    let bookmark: BookmarkItem = store.bookmarks.find(x => x.url === selectedTab.url);

    if (!bookmark) {
      bookmark = await addBookmark({
        title: selectedTab.title,
        url: selectedTab.url,
        parent: -1,
        type: 'item',
        favicon: selectedTab.favicon,
      });
    }

    store.bookmarkDialog.show(bookmark);
  };

  public render() {
    return (
      <StyledToolbar isHTMLFullscreen={store.isHTMLFullscreen}>
        <Handle />
        <NavigationButtons />
        <ToolbarSeparator style={{ marginRight: 16 }} />
        <TabsSection>
          <AddressBar visible={store.addressBar.toggled} />
          <TabBar />
        </TabsSection>
        <ToolbarSeparator style={{ marginLeft: 16 }} />
        <div style={{ position: 'relative' }}>
          <ToolbarButton
            size={20}
            icon={store.isBookmarked ? starIcon : starBorderIcon}
            onMouseDown={this.onStarIconMouseDown}
            onClick={this.onStarIconClick}
          />
          <BookmarksDialog ref={r => (store.bookmarkDialog = r)} />
        </div>
        <ToolbarButton size={16} icon={workspacesIcon} onClick={this.onWorkspacesIconClick} />
        <ToolbarButton
          onClick={this.toggleMenu}
          size={20}
          icon={menuIcon}
          style={{ marginRight: 4 }}
        />
        {store.platform !== Platforms.MacOS && <WindowsControls />}
        <Line />
      </StyledToolbar>
    );
  }
}
