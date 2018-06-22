import React from 'react';
import { observer } from 'mobx-react';
import { Styled, Title, Header, Dark, NavContent, Content } from './styles';
import Item from './Item';
import Search from './Search';
import menuItems from '../../defaults/menu-items';
import HistoryStore from '../../../menu/history/store';
import Store from '../../store';
import { NavigationDrawerItems } from '../../enums';

const deleteIcon = require('../../../shared/icons/delete.svg');
const selectAllIcon = require('../../../shared/icons/select-all.svg');
const closeIcon = require('../../../shared/icons/close.svg');

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
      requestAnimationFrame(() => {
        Store.navigationDrawer.selectedItem = item.props.page;
      });
    }
  };

  private getItem = (page: NavigationDrawerItems, items: any) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].type === page) return items[i];
    }

    return null;
  };

  public render() {
    const { children, title } = this.props;

    const selected = Store.navigationDrawer.selectedItem;
    const hideContent = Store.navigationDrawer.hideContent;

    const items = [...menuItems];

    const historyItem = items.find(x => x.type === NavigationDrawerItems.History);

    if (HistoryStore.selectedItems.length > 0) {
      historyItem.subItems[1].label = 'Deselect all';
      historyItem.subItems[1].icon = closeIcon;
      historyItem.subItems[2] = {
        label: 'Remove selected items',
        icon: deleteIcon,
      };
    } else {
      historyItem.subItems[1].label = 'Select all';
      historyItem.subItems[1].icon = selectAllIcon;
      historyItem.subItems = [
        ...historyItem.subItems.slice(0, 2),
        ...historyItem.subItems.slice(2 + 1),
      ];
    }

    const selectedItem = this.getItem(selected, items);

    const contentVisible = !hideContent && selectedItem != null && selectedItem.content != null;
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
                  <Item onClick={subItemData.onClick} icon={subItemData.icon} key={subItemKey}>
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
