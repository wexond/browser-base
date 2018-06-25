import React from 'react';
import { observer } from 'mobx-react';
import {
  Container, Title, Header, Dark, Menu, Content,
} from './styles';
import Item from './Item';
import Search from './Search';
import menuItems from '../../defaults/menu-items';
import HistoryStore from '../../../menu/history/store';
import Store from '../../store';
import { MenuItems } from '../../enums';

interface Props {
  children?: any;
  title?: string;
}

@observer
export default class extends React.Component<Props, {}> {
  public static Item = Item;

  public onDarkClick = () => {
    requestAnimationFrame(() => {
      Store.menu.visible = false;
      Store.menu.selectedItem = null;
    });
  };

  private onItemClick = (e: React.MouseEvent<HTMLDivElement>, item: Item) => {
    if (item != null && item.props.page != null) {
      requestAnimationFrame(() => {
        Store.menu.selectedItem = item.props.page;
      });
    }
  };

  private getItem = (page: MenuItems, items: any) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].type === page) return items[i];
    }

    return null;
  };

  public render() {
    const { title } = this.props;

    const selected = Store.menu.selectedItem;
    const hideContent = Store.menu.hideContent;

    const items = [...menuItems];

    const historyItem = items[0];

    if (HistoryStore.selectedItems.length > 0) {
      historyItem.subItems[1].visible = false; // Select all
      historyItem.subItems[2].visible = true; // Deselect all
      historyItem.subItems[3].visible = true; // Remove selected items
    } else {
      historyItem.subItems[1].visible = true; // Select all
      historyItem.subItems[2].visible = false; // Deselect all
      historyItem.subItems[3].visible = false; // Remove selected items
    }

    const selectedItem = this.getItem(selected, items);

    const contentVisible = !hideContent && selectedItem != null && selectedItem.content != null;
    const searchVisible = selectedItem != null && selectedItem.searchVisible;

    return (
      <React.Fragment>
        <Container visible={Store.menu.visible} contentVisible={contentVisible}>
          <Content visible={contentVisible}>{selectedItem != null && selectedItem.content}</Content>
          <Menu>
            <Header>{(searchVisible && <Search />) || <Title>{title}</Title>}</Header>
            {items.map((data: any, key: any) => (
              <Item
                onClick={this.onItemClick}
                icon={data.icon}
                selected={selectedItem != null && data.type === selectedItem.type}
                page={data.type}
                key={key}
                title={data.label}
                visible={data.visible}
              >
                {data.subItems.map((subItemData: any, subItemKey: any) => (
                  <Item
                    onClick={subItemData.onClick}
                    icon={subItemData.icon}
                    key={subItemKey}
                    title={subItemData.label}
                    visible={subItemData.visible}
                  />
                ))}
              </Item>
            ))}
          </Menu>
        </Container>
        <Dark onClick={this.onDarkClick} visible={Store.menu.visible} />
      </React.Fragment>
    );
  }
}
