import React, { SyntheticEvent } from 'react';
import { observer } from 'mobx-react';
import NavigationButtons from '../NavigationButtons';
import ToolbarSeparator from './Separator';
import {
  StyledToolbar, Handle, TabsSection, Line,
} from './styles';
import Store from '../../store';
import AddressBar from '../AddressBar';
import TabBar from '../TabBar';
import ToolbarButton from './Button';
import BookmarksDialog from '../BookmarksDialog';
import { Platforms } from '../../enums';
import WindowsControls from '../WindowsControls';
import { TOOLBAR_HEIGHT } from '../../constants';
import Tab from '../../models/tab';
import db from '../../../shared/models/app-database';

const workspacesIcon = require('../../../shared/icons/tab-groups.svg');
const menuIcon = require('../../../shared/icons/menu.svg');
const starIcon = require('../../../shared/icons/star.svg');
const starBorderIcon = require('../../../shared/icons/star-border.svg');

@observer
export default class Toolbar extends React.Component {
  public static Button = ToolbarButton;

  public static Separator = ToolbarSeparator;

  public onWorkspacesIconClick = () => {
    Store.workspaces.visible = true;
  };

  public toggleMenu = () => {
    Store.menu.visible = !Store.menu.visible;
  };

  public onStarIconMouseDown = (e: SyntheticEvent<any>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  public onStarIconClick = () => {
    Store.bookmarksDialogVisible = !Store.bookmarksDialogVisible;

    db.transaction('rw', db.bookmarks, async () => {
      const currentTab: Tab = Store.getCurrentWorkspace().getSelectedTab();

      const id = await db.bookmarks.add({
        title: currentTab.title,
        url: currentTab.url,
        parent: -1,
        type: 'item',
      });
    });
  };

  public render() {
    const star = Store.getCurrentWorkspace().getSelectedTab().isSavedAsBookmark
      ? starIcon
      : starBorderIcon;

    return (
      <StyledToolbar isFullscreen={Store.isFullscreen}>
        <Handle />
        <NavigationButtons />
        <ToolbarSeparator style={{ marginRight: 16 }} />
        <TabsSection>
          <AddressBar visible={Store.addressBar.toggled} />
          <TabBar />
        </TabsSection>
        <ToolbarSeparator style={{ marginLeft: 16 }} />
        <div style={{ position: 'relative' }}>
          <ToolbarButton
            size={20}
            icon={star}
            onMouseDown={this.onStarIconMouseDown}
            onClick={this.onStarIconClick}
          />
          <BookmarksDialog visible={Store.bookmarksDialogVisible} />
        </div>
        <ToolbarButton size={16} icon={workspacesIcon} onClick={this.onWorkspacesIconClick} />
        <ToolbarButton
          onClick={this.toggleMenu}
          size={20}
          icon={menuIcon}
          style={{ marginRight: 4 }}
        />
        {Store.platform !== Platforms.MacOS && <WindowsControls />}
        <Line />
      </StyledToolbar>
    );
  }
}
