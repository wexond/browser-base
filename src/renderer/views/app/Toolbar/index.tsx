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
import { Platforms } from '../../../../enums';
import { BookmarkItem } from '../../../../interfaces';
import { addBookmark } from '../../../../utils';
import { icons } from '../../../../defaults';

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
            icon={store.isBookmarked ? icons.star : icons.starBorder}
            onMouseDown={this.onStarIconMouseDown}
            onClick={this.onStarIconClick}
          />
          <BookmarksDialog ref={r => (store.bookmarkDialog = r)} />
        </div>
        <ToolbarButton size={16} icon={icons.workspaces} onClick={this.onWorkspacesIconClick} />
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
