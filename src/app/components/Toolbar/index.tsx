import React from 'react';
import { observer } from 'mobx-react';
import NavigationButtons from '../NavigationButtons';
import ToolbarSeparator from './Separator';
import { StyledToolbar, Handle, TabsSection, Line } from './styles';
import Store from '../../store';
import AddressBar from '../AddressBar';
import TabBar from '../TabBar';
import ToolbarButton from './Button';
import { Platforms, NavigationDrawerItems } from '../../enums';

const tabGroupsIcon = require('../../../shared/icons/tab-groups.svg');
const menuIcon = require('../../../shared/icons/menu.svg');

@observer
export default class Toolbar extends React.Component {
  public static Button = ToolbarButton;
  public static Separator = ToolbarSeparator;

  public onTabGroupsIconClick = () => {
    this.toggleMenu();

    requestAnimationFrame(() => {
      Store.navigationDrawer.selectedItem = NavigationDrawerItems.TabGroups;
    });
  };

  public toggleMenu = () => {
    Store.navigationDrawer.visible = !Store.navigationDrawer.visible;
  };

  public render() {
    const { theme } = Store.theme;

    return (
      <StyledToolbar style={{ ...theme.toolbar }}>
        <Handle />
        <NavigationButtons />
        <ToolbarSeparator style={{ marginRight: 0, ...theme.toolbarSeparators }} />
        <TabsSection style={{ ...theme.tabsSection }}>
          <AddressBar visible={Store.addressBar.toggled} />
          <TabBar />
        </TabsSection>
        <ToolbarSeparator style={{ marginLeft: 0, ...theme.toolbarSeparators }} />
        <ToolbarButton size={16} icon={tabGroupsIcon} onClick={this.onTabGroupsIconClick} />
        <ToolbarButton
          onClick={this.toggleMenu}
          size={20}
          icon={menuIcon}
          style={{ marginRight: 4 }}
        />
        {Store.platform !== Platforms.MacOS && <React.Fragment />}
        <Line style={{ ...theme.toolbarBottomLine }} />
      </StyledToolbar>
    );
  }
}
