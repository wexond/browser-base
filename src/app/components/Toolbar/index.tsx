import React from 'react';
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
import { Platforms } from '../../enums';
import WindowsControls from '../WindowsControls';

const workspacesIcon = require('../../../shared/icons/tab-groups.svg');
const menuIcon = require('../../../shared/icons/menu.svg');

@observer
export default class Toolbar extends React.Component {
  public static Button = ToolbarButton;

  public static Separator = ToolbarSeparator;

  public onWorkspacesIconClick = () => {};

  public toggleMenu = () => {
    Store.menu.visible = !Store.menu.visible;
  };

  public render() {
    const { theme } = Store.theme;

    return (
      <StyledToolbar style={{ ...theme.toolbar }}>
        <Handle />
        <NavigationButtons />
        <ToolbarSeparator style={{ marginRight: 16, ...theme.toolbarSeparators }} />
        <TabsSection style={{ ...theme.tabsSection }}>
          <AddressBar visible={Store.addressBar.toggled} />
          <TabBar />
        </TabsSection>
        <ToolbarSeparator style={{ marginLeft: 16, ...theme.toolbarSeparators }} />
        <ToolbarButton size={16} icon={workspacesIcon} onClick={this.onWorkspacesIconClick} />
        <ToolbarButton
          onClick={this.toggleMenu}
          size={20}
          icon={menuIcon}
          style={{ marginRight: 4 }}
        />
        {Store.platform !== Platforms.MacOS && <WindowsControls />}
        <Line style={{ ...theme.toolbarBottomLine }} />
      </StyledToolbar>
    );
  }
}
