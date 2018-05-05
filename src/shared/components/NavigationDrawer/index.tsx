import React from 'react';
import { observer } from 'mobx-react';

import ToolbarIcon from '../ToolbarIcon';

import {
  StyledNavigationDrawer,
  Item,
  ItemTitle,
  Items,
  ItemIcon,
  Line,
  Indicator,
  Title,
  Header,
} from './styles';
import SearchInput from '../SearchInput';

const menuIcon = require('../../icons/actions/menu.svg');

@observer
export default class NavigationDrawer extends React.Component {
  public render() {
    return (
      <StyledNavigationDrawer>
        <Header>
          <ToolbarIcon image={menuIcon} />
          <Title>Wexond</Title>
        </Header>
        <Line />
        <Items>
          <Item>
            <Indicator />
            <ItemIcon style={{ opacity: 1 }} />
            <ItemTitle style={{ opacity: 1, fontWeight: 500 }}>History</ItemTitle>
          </Item>
          <Item>
            <ItemIcon style={{ marginLeft: 84 }} />
            <ItemTitle>Clear browsing data</ItemTitle>
          </Item>
          <Item>
            <ItemIcon />
            <ItemTitle>Bookmarks</ItemTitle>
          </Item>
          <Item>
            <ItemIcon />
            <ItemTitle>Settings</ItemTitle>
          </Item>
          <Item>
            <ItemIcon />
            <ItemTitle>Extensions</ItemTitle>
          </Item>
        </Items>
      </StyledNavigationDrawer>
    );
  }
}
