import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { hot } from 'react-hot-loader/root';

import store, { QuickRange } from '../../store';
import { NavigationDrawer } from '~/renderer/components/NavigationDrawer';
import { Style } from '../../style';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { icons } from '~/renderer/constants/icons';
import { SelectionDialog } from '~/renderer/components/SelectionDialog';
import { HistorySection } from '../HistorySection';
import { Container, Content, LeftContent } from '~/renderer/components/Pages';
import { GlobalNavigationDrawer } from '~/renderer/components/GlobalNavigationDrawer';

const GlobalStyle = createGlobalStyle`${Style}`;

const onScroll = (e: any) => {
  const scrollPos = e.target.scrollTop;
  const scrollMax = e.target.scrollHeight - e.target.clientHeight - 256;

  if (scrollPos >= scrollMax) {
    store.itemsLoaded += store.getDefaultLoaded();
  }
};

const RangeItem = observer(
  ({
    range,
    children,
    icon,
  }: {
    range: QuickRange;
    children: any;
    icon: string;
  }) => (
    <NavigationDrawer.Item
      onClick={() => (store.selectedRange = range)}
      selected={store.selectedRange === range}
      icon={icon}
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
    <LeftContent style={{ margin: '32px 64px' }}>
      <SelectionDialog
        theme={store.theme}
        visible={store.selectedItems.length > 0}
        amount={store.selectedItems.length}
        onDeleteClick={onDeleteClick}
        onCancelClick={onCancelClick}
      />
      {store.sections.map(data => (
        <HistorySection data={data} key={data.date.getTime()} />
      ))}
    </LeftContent>
  );
});

const onInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  store.search(e.currentTarget.value);
};

const onClearClick = () => {
  store.clear();

  // TODO: ipcRenderer.send('clear-browsing-data');
};

export default hot(
  observer(() => {
    return (
      <ThemeProvider theme={{ ...store.theme }}>
        <Container>
          <GlobalStyle />
          <GlobalNavigationDrawer></GlobalNavigationDrawer>
          <NavigationDrawer title="History" search onSearchInput={onInput}>
            <RangeItem icon={icons.all} range="all">
              All
            </RangeItem>
            <RangeItem icon={icons.today} range="today">
              Today
            </RangeItem>
            <RangeItem icon={icons.history} range="yesterday">
              Yesterday
            </RangeItem>
            <RangeItem icon={icons.week} range="last-week">
              Last week
            </RangeItem>
            <RangeItem icon={icons.calendar} range="older">
              Older
            </RangeItem>
            <div style={{ flex: 1 }} />
            <NavigationDrawer.Item icon={icons.trash} onClick={onClearClick}>
              Clear browsing data
            </NavigationDrawer.Item>
          </NavigationDrawer>
          <Content onScroll={onScroll}>
            <HistorySections />
          </Content>
        </Container>
      </ThemeProvider>
    );
  }),
);
