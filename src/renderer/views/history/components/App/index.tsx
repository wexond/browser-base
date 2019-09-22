import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store, { QuickRange } from '../../store';
import { NavigationDrawer } from '~/renderer/components/NavigationDrawer';
import { Container, Sections, Content } from './style';
import { Style } from '../../style';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { icons } from '~/renderer/constants/icons';
import { SelectionDialog } from '~/renderer/components/SelectionDialog';
import { HistorySection } from '../HistorySection';

const GlobalStyle = createGlobalStyle`${Style}`;

const RangeItem = observer(
  ({ range, children }: { range: QuickRange; children: any }) => (
    <NavigationDrawer.Item
      onClick={() => (store.selectedRange = range)}
      selected={store.selectedRange === range}
    >
      {children}
    </NavigationDrawer.Item>
  ),
);

const onCancelClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  store.selectedItems = [];
};

const onDeleteClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  store.deleteSelected();
};

const HistorySections = observer(() => {
  return (
    <Sections>
      {store.sections.map(data => (
        <HistorySection data={data} key={data.date.getTime()} />
      ))}
      <SelectionDialog
        theme={store.theme}
        visible={store.selectedItems.length > 0}
        amount={store.selectedItems.length}
        onDeleteClick={onDeleteClick}
        onCancelClick={onCancelClick}
      />
    </Sections>
  );
});

const onInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  store.search(e.currentTarget.value);
};

const onClearClick = () => {
  store.clear();

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
        <Content>
          <HistorySections />
        </Content>
      </Container>
    </ThemeProvider>
  );
});
