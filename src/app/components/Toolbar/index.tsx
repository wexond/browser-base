import React from 'react';
import { observer } from 'mobx-react';
import NavigationButtons from '../NavigationButtons';
import ToolbarSeparator from './Separator';
import { StyledToolbar, Handle, TabsSection, Line } from './styles';
import Store from '../../store';
import AddressBar from '../AddressBar';
import TabBar from '../TabBar';
import ToolbarButton from './Button';
import { Platforms } from '../../enums';

const tabGroupsIcon = require('../../../shared/icons/tab-groups.svg');
const menuIcon = require('../../../shared/icons/menu.svg');

@observer
export default class Toolbar extends React.Component {
  public static Button = ToolbarButton;
  public static Separator = ToolbarSeparator;

  public onMenuClick = () => {
    Store.navigationDrawer.visible = !Store.navigationDrawer.visible;
  };

  public render() {
    const { theme } = Store.theme;

    return (
      <StyledToolbar style={{ ...theme.toolbar.style }}>
        <Handle />
        <NavigationButtons />
        <ToolbarSeparator style={{ ...theme.toolbar.separators.style }} />
        <TabsSection style={{ ...theme.tabsSection.style }}>
          <AddressBar visible={Store.addressBar.toggled} />
          <TabBar />
        </TabsSection>
        <ToolbarSeparator style={{ ...theme.toolbar.separators.style }} />
        <ToolbarButton size={16} icon={tabGroupsIcon} />
        <ToolbarButton
          onClick={this.onMenuClick}
          size={20}
          icon={menuIcon}
          style={{ marginRight: 4 }}
        />
        {Store.platform !== Platforms.MacOS && <React.Fragment />}
        <Line style={{ ...theme.toolbar.bottomDivider.style }} />
      </StyledToolbar>
    );
  }
}
