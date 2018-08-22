import { observer } from 'mobx-react';
import React from 'react';
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
import store from '@app/store';
import MenuItem from '../MenuItem';

interface Props {
  children?: any;
  title?: string;
}

@observer
export default class extends React.Component<Props, {}> {
  public static Item = MenuItem;

  private items: MenuItem[] = [];

  public onDarkClick = () => {
    requestAnimationFrame(() => {
      store.menuStore.hide();
    });
  };

  public render() {
    const { title, children } = this.props;

    let id = 0;
    let id2 = 0;

    this.items = this.items.filter(Boolean);

    let selectedItem;

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item && item.props.id === store.menuStore.selectedItem) {
        selectedItem = item;
        break;
      }
    }

    return (
      <React.Fragment>
        <Container visible={store.menuStore.visible}>
          <Content visible={selectedItem != null}>
            {React.Children.map(children, (el: React.ReactElement<any>) => {
              if (!el.props.title) {
                id2++;
                return (
                  <div
                    style={{
                      opacity: store.menuStore.selectedItem === id2 - 1 ? 1 : 0,
                      pointerEvents:
                        store.menuStore.selectedItem === id2 - 1
                          ? 'auto'
                          : 'none',
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
                  ref: (r: MenuItem) => this.items.push(r),
                  onClick: this.onItemClick,
                });
              }

              return null;
            })}
          </Menu>
        </Container>
        <Dark onClick={this.onDarkClick} visible={store.menuStore.visible} />
      </React.Fragment>
    );
  }

  private onItemClick = (
    e: React.MouseEvent<HTMLDivElement>,
    item: MenuItem,
  ) => {
    if (item) {
      store.menuStore.selectedItem = item.props.id;
    }
  };

  private onInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    store.menuStore.searchText = e.currentTarget.value;
  };
}
