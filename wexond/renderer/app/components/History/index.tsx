import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import HistorySection from '../HistorySection';
import { QuickRange } from '../../store/history';
import { Button } from '~/renderer/components/Button';
import { Sections, DeletionDialog, DeletionDialogLabel } from './style';
import { NavigationDrawer } from '../NavigationDrawer';
import { Content, Container, Scrollable } from '../Overlay/style';
import { SelectionDialog } from '../SelectionDialog';
import { icons } from '../../constants';
import { ipcRenderer } from 'electron';

const scrollRef = React.createRef<HTMLDivElement>();

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

const onCancelClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  store.history.selectedItems = [];
};

const onDeleteClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  store.history.deleteSelected();
};

const onBackClick = () => {
  scrollRef.current.scrollTop = 0;
  store.history.resetLoadedItems();
};

const HistorySections = observer(() => {
  return (
    <Sections>
      <Content>
        {store.history.sections.map(data => (
          <HistorySection data={data} key={data.date.getTime()} />
        ))}
      </Content>
    </Sections>
  );
});

const MenuItem = observer(
  ({ range, children }: { range: QuickRange; children: any }) => (
    <NavigationDrawer.Item
      onClick={() => (store.history.selectedRange = range)}
      selected={store.history.selectedRange === range}
    >
      {children}
    </NavigationDrawer.Item>
  ),
);

const onClearClick = () => {
  store.history.clear();

  ipcRenderer.send('clear-browsing-data');
};

export const History = observer(() => {
  const { length } = store.history.selectedItems;

  return (
    <Container
      right
      onClick={preventHiding}
      visible={
        store.overlay.currentContent === 'history' && store.overlay.visible
      }
    >
      <Scrollable onScroll={onScroll} ref={scrollRef}>
        <NavigationDrawer
          title="History"
          search
          onSearchInput={onInput}
          onBackClick={onBackClick}
        >
          <MenuItem range="all">All</MenuItem>
          <MenuItem range="today">Today</MenuItem>
          <MenuItem range="yesterday">Yesterday</MenuItem>
          <MenuItem range="last-week">Last week</MenuItem>
          <MenuItem range="last-month">Last month</MenuItem>
          <MenuItem range="older">Older</MenuItem>
          <div style={{ flex: 1 }} />
          <NavigationDrawer.Item icon={icons.trash} onClick={onClearClick}>
            Clear browsing data
          </NavigationDrawer.Item>
        </NavigationDrawer>
        <HistorySections />
        <SelectionDialog
          visible={length > 0}
          amount={length}
          onDeleteClick={onDeleteClick}
          onCancelClick={onCancelClick}
        />
      </Scrollable>
    </Container>
  );
});
