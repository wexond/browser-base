import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import { Container, Scrollable, Content, Back } from '../Overlay/style';
import HistorySection from '../HistorySection';
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
    store.historyStore.itemsLoaded += window.innerHeight / 48;
  }
};

const select = (
  item: 'all' | 'yesterday' | 'last-week' | 'last-month' | 'older',
) => () => {
  const current = new Date(); // new Date(2019, 3, 21);
  const day = current.getDate();
  const month = current.getMonth();
  const year = current.getFullYear();
  let minDate: Date;
  let maxDate: Date;

  switch (item) {
    case 'yesterday': {
      minDate = new Date(year, month, day - 1, 0, 0, 0, 0);
      maxDate = new Date(year, month, day - 1, 23, 59, 59, 999);
      break;
    }
    case 'last-week': {
      // TODO
      minDate = new Date(year, month, day - current.getDay() - 6, 0, 0, 0, 0);

      console.clear();
      console.log(minDate);
      break;
    }
    case 'last-month': {
      minDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
      maxDate = new Date(year, month - 1, 0, 0, 0, 0, 0);
      break;
    }
    case 'older': {
      // store.historyStore.maxDate = null;
      break;
    }
  }

  store.historyStore.range = item !== 'all' && {
    min: minDate.getTime(),
    max: maxDate.getTime(),
  };

  store.historyStore.itemsLoaded = window.innerHeight / 48;
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
            <Input placeholder="Search" />
          </Search>
          <MenuItems>
            <MenuItem onClick={select('all')} selected>
              All
            </MenuItem>
            <MenuItem onClick={select('yesterday')}>Yesterday</MenuItem>
            <MenuItem>Last week</MenuItem>
            <MenuItem onClick={select('last-month')}>Last month</MenuItem>
            <MenuItem>Older</MenuItem>
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
