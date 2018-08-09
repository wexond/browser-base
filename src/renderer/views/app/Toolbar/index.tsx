import { observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';

import { icons } from '../../../../defaults';
import { Platforms } from '../../../../enums';
import { BookmarkItem } from '../../../../interfaces';
import { addBookmark, getSelectedTab } from '../../../../utils';
import store from '../../../store';
import AddressBar from '../AddressBar';
import BookmarksDialog from '../BookmarksDialog';
import NavigationButtons from '../NavigationButtons';
import TabBar from '../TabBar';
import WindowsControls from '../WindowsControls';
import Button from './Button';
import Separator from './Separator';
import { Handle, Line, StyledToolbar, TabsSection } from './styles';

@observer
export default class Toolbar extends React.Component {
  public static Button = Button;

  public static Separator = Separator;

  public onWorkspacesIconClick = () => {
    store.workspacesMenuVisible = true;
  }

  public toggleMenu = () => {
    store.menu.visible = !store.menu.visible;
  }

  public onStarIconMouseDown = (e: SyntheticEvent<any>) => {
    e.preventDefault();
    e.stopPropagation();
  }

  public onStarIconClick = async () => {
    const selectedTab = getSelectedTab();

    let bookmark: BookmarkItem = store.bookmarks.find(
      x => x.url === selectedTab.url,
    );

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
  }

  public render() {
    return (
      <StyledToolbar isHTMLFullscreen={store.isHTMLFullscreen}>
        <Handle />
        <NavigationButtons />
        <Separator style={{ marginRight: 16 }} />
        <TabsSection>
          <AddressBar visible={store.addressBar.toggled} />
          <TabBar />
        </TabsSection>
        <Separator style={{ marginLeft: 16 }} />
        <div style={{ position: 'relative' }}>
          <Button
            size={20}
            icon={store.isBookmarked ? icons.star : icons.starBorder}
            onMouseDown={this.onStarIconMouseDown}
            onClick={this.onStarIconClick}
          />
          <BookmarksDialog ref={r => (store.bookmarkDialog = r)} />
        </div>
        <Button
          size={16}
          icon={icons.workspaces}
          onClick={this.onWorkspacesIconClick}
        />
        <Button
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
