import React from 'react';
import { observer } from 'mobx-react';
import { Styled, Title, Header, Dark, NavContent, Content } from './styles';
import Item from './Item';
import Store from '../../store';
import History from '../../../menu-pages/history/components/History';
import Search from './Search';

const clearIcon = require('../../../shared/icons/clear.svg');
const historyIcon = require('../../../shared/icons/history.svg');
const bookmarksIcon = require('../../../shared/icons/bookmarks.svg');
const settingsIcon = require('../../../shared/icons/settings.svg');
const extensionsIcon = require('../../../shared/icons/extensions.svg');

interface Props {
  children?: any;
  title?: string;
}

@observer
export default class extends React.Component<Props, {}> {
  public static Item = Item;

  public onDarkClick = () => {
    requestAnimationFrame(() => {
      Store.navigationDrawer.visible = false;
      Store.navigationDrawer.selectedItem = '';
    });
  };

  public onHistoryClick = () => {
    Store.navigationDrawer.selectedItem = 'history';
  };

  public onBookmarksClick = () => {
    Store.navigationDrawer.selectedItem = 'bookmarks';
  };

  public onSettingsClick = () => {
    Store.navigationDrawer.selectedItem = 'settings';
  };

  public onExtensionsClick = () => {
    Store.navigationDrawer.selectedItem = 'extensions';
  };

  public render() {
    const { children, title } = this.props;

    const selected = Store.navigationDrawer.selectedItem;

    const contentVisible =
      selected === 'history' ||
      selected === 'extensions' ||
      selected === 'bookmarks' ||
      selected === 'settings';

    const searchVisible =
      selected === 'history' ||
      selected === 'bookmarks' ||
      selected === 'settings' ||
      selected === 'extensions';

    return (
      <React.Fragment>
        <Styled visible={Store.navigationDrawer.visible} contentVisible={contentVisible}>
          <Content visible={contentVisible}>{selected === 'history' && <History />}</Content>
          <NavContent>
            <Header>{(searchVisible && <Search />) || <Title>{title}</Title>}</Header>
            <Item
              onClick={this.onHistoryClick}
              icon={historyIcon}
              selected={selected === 'history'}
            >
              History
              <Item icon={clearIcon}>Clear browsing history</Item>
            </Item>
            <Item
              onClick={this.onBookmarksClick}
              icon={bookmarksIcon}
              selected={selected === 'bookmarks'}
            >
              Bookmarks
            </Item>
            <Item
              onClick={this.onSettingsClick}
              icon={settingsIcon}
              selected={selected === 'settings'}
            >
              Settings
            </Item>
            <Item
              onClick={this.onExtensionsClick}
              icon={extensionsIcon}
              selected={selected === 'extensions'}
            >
              Extensions
            </Item>
            <Item
              onClick={() => (Store.navigationDrawer.selectedItem = 'test')}
              icon={extensionsIcon}
              selected={selected === 'test'}
            >
              Test
            </Item>
          </NavContent>
        </Styled>
        <Dark onClick={this.onDarkClick} visible={Store.navigationDrawer.visible} />
      </React.Fragment>
    );
  }
}
