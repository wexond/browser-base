import { observer } from 'mobx-react';
import React from 'react';
import store from '../../../store';
import Item from './Item';
import {
  Container,
  Content,
  Dark,
  Header,
  Input,
  Menu,
  Search,
  SearchIcon,
  Title,
} from './styles';

interface Props {
  children?: any;
  title?: string;
}

@observer
export default class extends React.Component<Props, {}> {
  public static Item = Item;

  private items: Item[] = [];

  public onDarkClick = () => {
    requestAnimationFrame(() => {
      store.menu.hide();
      store.menu.searchText = '';
    });
  }

  public render() {
    const { title, children } = this.props;

    let id = 0;
    let id2 = 0;

    this.items = this.items.filter(Boolean);

    let selectedItem;

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item && item.props.id === store.menu.selectedItem) {
        selectedItem = item;
        break;
      }
    }

    return (
      <React.Fragment>
        <Container visible={store.menu.visible}>
          <Content visible={selectedItem != null}>
            {React.Children.map(children, (el: React.ReactElement<any>) => {
              if (!el.props.title) {
                id2++;
                return (
                  <div
                    style={{
                      opacity: store.menu.selectedItem === id2 - 1 ? 1 : 0,
                      pointerEvents:
                        store.menu.selectedItem === id2 - 1 ? 'auto' : 'none',
                      position: 'absolute',
                      top: 0,
                      width: '100%',
                      height: '100vh',
                    }}
                  >
                    {React.cloneElement(el)}
                  </div>
                );
              }

              return null;
            })}
          </Content>
          <Menu>
            <Header>
              {(selectedItem &&
                selectedItem.props.searchVisible && (
                  <Search>
                    <SearchIcon />
                    <Input placeholder="Search" onInput={this.onInput} />
                  </Search>
                )) || <Title>{title}</Title>}
            </Header>

            {React.Children.map(children, (el: React.ReactElement<any>) => {
              if (el.props.title) {
                return React.cloneElement(el, {
                  id: id++,
                  ref: (r: Item) => this.items.push(r),
                  onClick: this.onItemClick,
                });
              }

              return null;
            })}
          </Menu>
        </Container>
        <Dark onClick={this.onDarkClick} visible={store.menu.visible} />
      </React.Fragment>
    );
  }

  private onItemClick = (e: React.MouseEvent<HTMLDivElement>, item: Item) => {
    if (item) {
      store.menu.selectedItem = item.props.id;
    }
  }

  private onInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    store.menu.searchText = e.currentTarget.value;
  }
}
