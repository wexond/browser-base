import React from 'react';
import { observer } from 'mobx-react';
import { Styled, Title, Header, Dark, NavContent, Content } from './styles';
import Item from './Item';
import Store from '../../store';
import Search from './Search';

import TabGroups from '../../../menu/tabGroups/components/TabGroups';
import History from '../../../menu/history/components/History';
import About from '../../../menu/about/components/About';

import { NavigationDrawerItems } from '../../enums';

const tabGroupsIcon = require('../../../shared/icons/tab-groups.svg');
const historyIcon = require('../../../shared/icons/history.svg');
const clearIcon = require('../../../shared/icons/clear.svg');
const bookmarksIcon = require('../../../shared/icons/bookmarks.svg');
const settingsIcon = require('../../../shared/icons/settings.svg');
const extensionsIcon = require('../../../shared/icons/extensions.svg');
const aboutIcon = require('../../../shared/icons/info.svg');

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
      Store.navigationDrawer.selectedItem = null;
    });
  };

  private onItemClick = (e: React.MouseEvent<HTMLDivElement>, item: Item) => {
    if (item != null && item.props.page != null) {
      Store.navigationDrawer.selectedItem = item.props.page;
    }
  };

  private getItems = () => [
    {
      type: NavigationDrawerItems.TabGroups,
      label: 'Tab groups',
      icon: tabGroupsIcon,
      content: <TabGroups />,
      searchVisible: false,
      subItems: [],
    },
    {
      type: NavigationDrawerItems.History,
      label: 'History',
      icon: historyIcon,
      content: <History />,
      searchVisible: true,
      subItems: [
        {
          label: 'Clear browsing history',
          icon: clearIcon,
        },
      ],
    },
    {
      type: NavigationDrawerItems.Bookmarks,
      label: 'Bookmarks',
      icon: bookmarksIcon,
      content: null,
      searchVisible: false,
      subItems: [],
    },
    {
      type: NavigationDrawerItems.Settings,
      label: 'Settings',
      icon: settingsIcon,
      content: null,
      searchVisible: false,
      subItems: [],
    },
    {
      type: NavigationDrawerItems.Extensions,
      label: 'Extensions',
      icon: extensionsIcon,
      content: null,
      searchVisible: false,
      subItems: [],
    },
    {
      type: NavigationDrawerItems.About,
      label: 'About',
      icon: aboutIcon,
      content: <About />,
      searchVisible: false,
      subItems: [],
    },
  ];

  private getItem = (page: NavigationDrawerItems, items: any) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].type === page) return items[i];
    }

    return null;
  };

  public render() {
    const { children, title } = this.props;

    const selected = Store.navigationDrawer.selectedItem;

    const items = this.getItems();
    const selectedItem = this.getItem(selected, items);

    const contentVisible = selectedItem != null && selectedItem.content != null;
    const searchVisible = selectedItem != null && selectedItem.searchVisible;

    return (
      <React.Fragment>
        <Styled visible={Store.navigationDrawer.visible} contentVisible={contentVisible}>
          <Content visible={contentVisible}>{selectedItem != null && selectedItem.content}</Content>
          <NavContent>
            <Header>{(searchVisible && <Search />) || <Title>{title}</Title>}</Header>
            {items.map((data: any, key: any) => (
              <Item
                onClick={this.onItemClick}
                icon={data.icon}
                selected={selectedItem != null && data.type === selectedItem.type}
                page={data.type}
                key={key}
              >
                {data.subItems.map((subItemData: any, subItemKey: any) => (
                  <Item icon={subItemData.icon} key={key}>
                    {subItemData.label}
                  </Item>
                ))}
                {data.label}
              </Item>
            ))}
          </NavContent>
        </Styled>
        <Dark onClick={this.onDarkClick} visible={Store.navigationDrawer.visible} />
      </React.Fragment>
    );
  }
}
