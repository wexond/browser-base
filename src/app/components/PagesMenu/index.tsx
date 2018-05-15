import React from 'react';
import { observer } from 'mobx-react';
import { Title, Header, NavContent, Content } from '../NavigationDrawer/styles';

import Store from '../../store';

import NavigationDrawer from '../NavigationDrawer';
import Item from '../NavigationDrawer/Item';
import Search from '../NavigationDrawer/Search';

import About from '../../../menu/about/components/About';
import History from '../../../menu/history/components/History';

const clearIcon = require('../../../shared/icons/clear.svg');
const historyIcon = require('../../../shared/icons/history.svg');
const bookmarksIcon = require('../../../shared/icons/bookmarks.svg');
const settingsIcon = require('../../../shared/icons/settings.svg');
const extensionsIcon = require('../../../shared/icons/extensions.svg');
const aboutIcon = require('../../../shared/icons/info.svg');

interface Props {
  title?: string;
}

@observer
export default class extends React.Component<Props, {}> {
  public static Item = Item;

  public onItemClick = (e: React.MouseEvent<HTMLDivElement>, item: Item) => {
    if (item != null && item.props.pageName != null) {
      Store.navigationDrawer.selectedItem = item.props.pageName;
    }
  };

  public render() {
    const { children, title } = this.props;

    const selected = Store.navigationDrawer.selectedItem;

    const contentVisible =
      selected === 'history' ||
      selected === 'extensions' ||
      selected === 'bookmarks' ||
      selected === 'settings' ||
      selected === 'about';

    const searchVisible =
      selected === 'history' ||
      selected === 'bookmarks' ||
      selected === 'settings' ||
      selected === 'extensions';

    return (
      <NavigationDrawer>
        <Content visible={contentVisible}>
          {(selected === 'history' && <History />) || (selected === 'about' && <About />)}
        </Content>
        <NavContent>
          <Header>{(searchVisible && <Search />) || <Title>{title}</Title>}</Header>
          <Item
            onClick={this.onItemClick}
            icon={historyIcon}
            selected={selected === 'history'}
            pageName="history"
          >
            History
            <Item icon={clearIcon}>Clear browsing history</Item>
          </Item>
          <Item
            onClick={this.onItemClick}
            icon={bookmarksIcon}
            selected={selected === 'bookmarks'}
            pageName="bookmarks"
          >
            Bookmarks
          </Item>
          <Item
            onClick={this.onItemClick}
            icon={settingsIcon}
            selected={selected === 'settings'}
            pageName="settings"
          >
            Settings
          </Item>
          <Item
            onClick={this.onItemClick}
            icon={extensionsIcon}
            selected={selected === 'extensions'}
            pageName="extensions"
          >
            Extensions
          </Item>
          <Item
            onClick={this.onItemClick}
            icon={aboutIcon}
            selected={selected === 'about'}
            pageName="about"
          >
            About
          </Item>
        </NavContent>
      </NavigationDrawer>
    );
  }
}
