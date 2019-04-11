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
  StyledMenuItem,
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
    store.historyStore.itemsLoaded += store.historyStore.getDefaultLoaded();
  }
};

const onInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  store.historyStore.search(e.currentTarget.value);
};

const MenuItem = observer(
  ({ range, children }: { range: QuickRange; children: any }) => (
    <StyledMenuItem
      onClick={() => (store.historyStore.selectedRange = range)}
      selected={store.historyStore.selectedRange === range}
    >
      {children}
    </StyledMenuItem>
  ),
);

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
            <MenuItem range="all">All</MenuItem>
            <MenuItem range="today">Today</MenuItem>
            <MenuItem range="yesterday">Yesterday</MenuItem>
            <MenuItem range="last-week">Last week</MenuItem>
            <MenuItem range="last-month">Last month</MenuItem>
            <MenuItem range="older">Older</MenuItem>
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
