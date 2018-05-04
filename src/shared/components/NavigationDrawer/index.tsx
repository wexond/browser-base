import React from 'react';
import { observer } from 'mobx-react';

import ToolbarIcon from '../ToolbarIcon';

import { StyledNavigationDrawer, Item, ItemTitle, Items, ItemIcon } from './styles';

const menuIcon = require('../../icons/actions/menu.svg');

@observer
export default class NavigationDrawer extends React.Component {
  public render() {
    return (
      <StyledNavigationDrawer>
        <Items>
          <Item style={{ backgroundColor: '#e0e0e0' }}>
            <ItemIcon style={{ backgroundColor: '#9575cd', opacity: 1 }} />
            <ItemTitle style={{ color: '#9575cd', opacity: 1 }}>History</ItemTitle>
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
