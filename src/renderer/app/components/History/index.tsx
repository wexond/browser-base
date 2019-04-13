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

const scrollRef = React.createRef<HTMLDivElement>();

const onBackClick = () => {
  scrollRef.current.scrollTop = 0;
  store.history.resetLoadedItems();
  store.overlay.currentContent = 'default';
};

const preventHiding = (e: any) => {
  e.stopPropagation();
};

const onScroll = (e: any) => {
  const scrollPos = e.target.scrollTop;
  const scrollMax = e.target.scrollHeight - e.target.clientHeight - 256;

  if (scrollPos >= scrollMax) {
    store.history.itemsLoaded += store.history.getDefaultLoaded();
  }
};

const onInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  store.history.search(e.currentTarget.value);
};

const MenuItem = observer(
  ({ range, children }: { range: QuickRange; children: any }) => (
    <StyledMenuItem
      onClick={() => (store.history.selectedRange = range)}
      selected={store.history.selectedRange === range}
    >
      {children}
    </StyledMenuItem>
  ),
);

const onCancelClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  store.history.selectedItems = [];
};

const onDeleteClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  store.history.deleteSelected();
};

const HistorySections = observer(() => {
  const selectedCount = store.history.selectedItems.length;

  return (
    <Sections>
      <Content style={{ paddingTop: selectedCount === 0 ? 0 : 108 }}>
        {store.history.sections.map(data => (
          <HistorySection data={data} key={data.date.getTime()} />
        ))}
      </Content>
    </Sections>
  );
});

const Dialog = observer(() => {
  const selectedCount = store.history.selectedItems.length;

  return (
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
  );
});

export const History = observer(() => {
  return (
    <Container
      right
      visible={
        store.overlay.currentContent !== 'default' && store.overlay.visible
      }
    >
      <Scrollable onScroll={onScroll} ref={scrollRef}>
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
        <HistorySections />
        <Dialog />
      </Scrollable>
    </Container>
  );
});
