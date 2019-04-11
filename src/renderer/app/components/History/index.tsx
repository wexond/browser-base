import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import HistorySection from '../HistorySection';
import { QuickRange } from '../../store/history';
import { Container, Scrollable, Content, Back } from '../Overlay/style';
import {
  LeftMenu,
  Header,
  Title,
  MenuItem,
  MenuItems,
  Sections,
  Search,
  Input,
} from './style';

const onBackClick = () => {
  store.overlayStore.scrollRef.current.scrollTop = 0;
  store.historyStore.resetLoadedItems();
  store.overlayStore.currentContent = 'default';
};

const preventHiding = (e: any) => {
  e.stopPropagation();
};

const onScroll = (e: any) => {
  const scrollPos = e.target.scrollTop;
  const scrollMax = e.target.scrollHeight - e.target.clientHeight - 64;

  if (scrollPos >= scrollMax) {
    store.historyStore.itemsLoaded += Math.floor(window.innerHeight / 48);
  }
};

const onMenuItemClick = (range: QuickRange) => () => {
  store.historyStore.select(range);
};

const onInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  store.historyStore.search(e.currentTarget.value);
};

export const History = observer(() => {
  return (
    <Container
      right
      visible={
        store.overlayStore.currentContent !== 'default' &&
        store.overlayStore.visible
      }
    >
      <Scrollable onScroll={onScroll}>
        <LeftMenu onClick={preventHiding}>
          <Header>
            <Back onClick={onBackClick} />
            <Title>History</Title>
          </Header>
          <Search>
            <Input placeholder="Search" onInput={onInput} />
          </Search>
          <MenuItems>
            <MenuItem onClick={onMenuItemClick('all')} selected>
              All
            </MenuItem>
            <MenuItem onClick={onMenuItemClick('yesterday')}>
              Yesterday
            </MenuItem>
            <MenuItem onClick={onMenuItemClick('last-week')}>
              Last week
            </MenuItem>
            <MenuItem onClick={onMenuItemClick('last-month')}>
              Last month
            </MenuItem>
            <MenuItem onClick={onMenuItemClick('older')}>Older</MenuItem>
          </MenuItems>
        </LeftMenu>
        <Sections>
          <Content>
            {store.historyStore.historySections.map((data, key) => (
              <HistorySection data={data} key={key} />
            ))}
          </Content>
        </Sections>
      </Scrollable>
    </Container>
  );
});
