import React from 'react';
import { observer } from 'mobx-react';
import { Title, Header, NavContent, Content } from '../NavigationDrawer/styles';

import Store from '../../store';

import NavigationDrawer from '../NavigationDrawer';
import Item from '../NavigationDrawer/Item';
import Search from '../NavigationDrawer/Search';

import TabsManagment from '../../../menu/tabs-management/components/TabsManagement';

const manageIcon = require('../../../shared/icons/settings.svg');

interface Props {
  title?: string;
}

@observer
export default class extends React.Component<Props, {}> {
  private static Item = Item;

  private onItemClick = (e: React.MouseEvent<HTMLDivElement>, item: Item) => {
    if (item != null && item.props.pageName != null) {
      Store.tabGroupsNavigationDrawer.selectedItem = item.props.pageName;
    }
  };

  public render() {
    const { children, title } = this.props;

    const selected = Store.tabGroupsNavigationDrawer.selectedItem;

    const contentVisible = selected === 'manage';

    const searchVisible = false;

    return (
      <NavigationDrawer store={Store.tabGroupsNavigationDrawer}>
        <Content visible={contentVisible}>{selected === 'manage' && <TabsManagment />}</Content>
        <NavContent>
          <Header>{(searchVisible && <Search />) || <Title>{title}</Title>}</Header>
          <Item
            onClick={this.onItemClick}
            icon={manageIcon}
            selected={selected === 'manage'}
            pageName="manage"
          >
            Manage
          </Item>
        </NavContent>
      </NavigationDrawer>
    );
  }
}
