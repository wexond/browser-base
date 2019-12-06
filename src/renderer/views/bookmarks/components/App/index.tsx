import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { hot } from 'react-hot-loader/root';

import store from '../../store';
import { NavigationDrawer } from '~/renderer/components/NavigationDrawer';
import { Style } from '../../style';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { icons } from '~/renderer/constants/icons';
import { SelectionDialog } from '~/renderer/components/SelectionDialog';
import { Container, Content, LeftContent } from '~/renderer/components/Pages';
import { GlobalNavigationDrawer } from '~/renderer/components/GlobalNavigationDrawer';
import { IBookmark } from '~/interfaces';
import { PathView, PathItem } from './style';
import {
  ContextMenu,
  ContextMenuItem,
} from '~/renderer/components/ContextMenu';
import { getBookmarkTitle, addImported } from '../../utils';
import { EmptySection } from '../BookmarksSection/style';
import Tree from '../Tree';
import { Bookmark } from '../Bookmark';
import { ipcRenderer } from 'electron';

const GlobalStyle = createGlobalStyle`${Style}`;

const onScroll = (e: any) => {
  const scrollPos = e.target.scrollTop;
  const scrollMax = e.target.scrollHeight - e.target.clientHeight - 256;

  if (scrollPos >= scrollMax) {
    store.itemsLoaded += store.getDefaultLoaded();
  }
};

const onCancelClick = () => {
  store.selectedItems = [];
};

const onDeleteClick = () => {
  store.deleteSelected();
};

const onRemoveClick = (item: IBookmark) => () => {
  store.removeItem(item._id);
};

const onInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  store.search(e.currentTarget.value);
};

const onNewFolderClick = () => {
  store.addItem({
    title: 'New folder',
    isFolder: true,
    parent: store.currentFolder,
    children: [],
  });
};

const onPathItemClick = (item: IBookmark) => () => {
  if (item) {
    store.currentFolder = item._id;
  } else {
    store.currentFolder = null;
  }
};

const onImportClick = async () => {
  const res = await ipcRenderer.invoke('import-bookmarks');
  console.log(res);
  addImported(res);
};

const BookmarksList = observer(() => {
  const items = store.visibleItems;

  return (
    <LeftContent>
      <SelectionDialog
        theme={store.theme}
        visible={length > 1}
        amount={length}
        onDeleteClick={onDeleteClick}
        onCancelClick={onCancelClick}
      />
      <PathView>
        <PathItem onClick={onPathItemClick(null)} key={null}>
          Home
        </PathItem>
        {store.path.map(item => (
          <PathItem onClick={onPathItemClick(item)} key={item._id}>
            {getBookmarkTitle(item)}
          </PathItem>
        ))}
      </PathView>
      {!!items.length && (
        <EmptySection>
          {items.map(data => (
            <Bookmark data={data} key={data._id} />
          ))}
        </EmptySection>
      )}
    </LeftContent>
  );
});

export default hot(
  observer(() => {
    return (
      <ThemeProvider theme={{ ...store.theme }}>
        <Container>
          <GlobalStyle />
          <GlobalNavigationDrawer></GlobalNavigationDrawer>
          <NavigationDrawer title="Bookmarks" search onSearchInput={onInput}>
            <Tree />
            <div style={{ flex: 1 }} />
            <NavigationDrawer.Item
              icon={icons.newFolder}
              onClick={onNewFolderClick}
            >
              New folder
            </NavigationDrawer.Item>
            <NavigationDrawer.Item
              icon={icons.download}
              onClick={onImportClick}
            >
              Import
            </NavigationDrawer.Item>
          </NavigationDrawer>
          <ContextMenu
            style={{
              top: store.menuTop,
              left: store.menuLeft - 130,
            }}
            visible={store.menuVisible}
          >
            <ContextMenuItem
              onClick={onRemoveClick(store.currentBookmark)}
              icon={icons.trash}
            >
              Remove
            </ContextMenuItem>
          </ContextMenu>
          <Content onScroll={onScroll}>
            <BookmarksList />
          </Content>
        </Container>
      </ThemeProvider>
    );
  }),
);
