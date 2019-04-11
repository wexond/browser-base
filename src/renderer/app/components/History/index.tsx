import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import HistorySection from '../HistorySection';
import { QuickRange } from '../../store/history';
import { Container, Scrollable, Content, Back } from '../Overlay/style';
import { Button } from '~/renderer/components/Button';
import {
  LeftMenu,
  Header,
  Title,
  StyledMenuItem,
  MenuItems,
  Sections,
  Search,
  Input,
  DeletionDialog,
  DeletionDialogLabel,
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

const onCancelClick = () => {
  store.historyStore.selectedItems = [];
  for (const item of store.historyStore.historyItems) {
    if (item.selected) item.selected = false;
  }
};

const onDeleteClick = () => {
  store.historyStore.deleteSelected();
};

export const History = observer(() => {
  const selectedCount = store.historyStore.selectedItems.length;

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
          <Content style={{ paddingTop: selectedCount === 0 ? 0 : 108 }}>
            {store.historyStore.historySections.map((data, key) => (
              <HistorySection data={data} key={key} />
            ))}
          </Content>
        </Sections>
        <DeletionDialog visible={selectedCount !== 0}>
          <DeletionDialogLabel>{selectedCount} selected</DeletionDialogLabel>
          <Button style={{ marginLeft: 16 }} onClick={onDeleteClick}>
            Delete
          </Button>
          <Button
            background="#757575"
            style={{ marginLeft: 8 }}
            onClick={onCancelClick}
          >
            Cancel
          </Button>
        </DeletionDialog>
      </Scrollable>
    </Container>
  );
});
