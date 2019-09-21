import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '../../store';
import { NavigationDrawer } from '../NavigationDrawer';
import { Container } from './style';
import { Style } from '../../style';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { icons } from '~/renderer/constants';
import { SelectionDialog } from '~/renderer/components/SelectionDialog';

const GlobalStyle = createGlobalStyle`${Style}`;

const RangeItem = observer(
  ({ range, children }: { range: QuickRange; children: any }) => (
    <NavigationDrawer.Item
      onClick={() => (store.history.selectedRange = range)}
      selected={store.history.selectedRange === range}
    >
      {children}
    </NavigationDrawer.Item>
  ),
);

const onDeleteClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  store.history.deleteSelected();
};

const onInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  store.history.search(e.currentTarget.value);
};

const onCancelClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  store.history.selectedItems = [];
};

const onClearClick = () => {
  store.history.clear();

  // TODO: ipcRenderer.send('clear-browsing-data');
};

export default observer(() => {
  return (
    <ThemeProvider theme={store.theme}>
      <Container>
        <GlobalStyle />
        <NavigationDrawer title="History" search onSearchInput={onInput}>
          <RangeItem range="all">All</RangeItem>
          <RangeItem range="today">Today</RangeItem>
          <RangeItem range="yesterday">Yesterday</RangeItem>
          <RangeItem range="last-week">Last week</RangeItem>
          <RangeItem range="last-month">Last month</RangeItem>
          <RangeItem range="older">Older</RangeItem>
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
      </Container>
    </ThemeProvider>
  );
});
