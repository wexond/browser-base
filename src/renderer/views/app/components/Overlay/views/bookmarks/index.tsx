import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { remote } from 'electron';
import { promises } from 'fs';
import * as parse from 'node-bookmarks-parser';

import store from '~/renderer/views/app/store';
import { IBookmark } from '~/interfaces';
import { Container } from '../..';
import { NavigationDrawer } from '../../components/NavigationDrawer';
import { SelectionDialog } from '../../components/SelectionDialog';
import {
  ContextMenu,
  ContextMenuItem,
} from '~/renderer/components/ContextMenu';
import { icons } from '~/renderer/constants';
import { Bookmark } from './Bookmark';
import {
  getBookmarkTitle,
  addImported,
} from '~/renderer/views/app/utils/bookmarks';
import Tree from './Tree';
import { BookmarkSection, PathItem, PathView } from './style';
import { Content, Scrollable2, Sections } from '../../style';

const scrollRef = React.createRef<HTMLDivElement>();

const onBackClick = () => {
  scrollRef.current.scrollTop = 0;
  store.bookmarks.resetLoadedItems();
};

const onScroll = (e: any) => {
  const scrollPos = e.target.scrollTop;
  const scrollMax = e.target.scrollHeight - e.target.clientHeight - 256;

  if (scrollPos >= scrollMax) {
    store.bookmarks.itemsLoaded += store.bookmarks.getDefaultLoaded();
  }
};

const onInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  store.bookmarks.search(e.currentTarget.value);
};

const onCancelClick = () => {
  store.bookmarks.selectedItems = [];
};

const onDeleteClick = () => {
  store.bookmarks.deleteSelected();
};

const onRemoveClick = (item: IBookmark) => () => {
  store.bookmarks.removeItem(item._id);
};

const onUnpinClick = (item: IBookmark) => () => {
  const tab = store.tabs.list.find(x => x.url === item.url && x.isPinned);
  if (tab){
    store.tabs.unpinTab(tab);
  }
  else{
    store.bookmarks.removeItem(item._id);
  }
};

const onNewFolderClick = () => {
  store.bookmarks.addItem({
    title: 'New folder',
    isFolder: true,
    parent: store.bookmarks.currentFolder,
    children: [],
  });
};

const onPathItemClick = (item: IBookmark) => () => {
  if (item) {
    store.bookmarks.currentFolder = item._id;
  } else {
    store.bookmarks.currentFolder = null;
  }
};

const onImportClick = async () => {
  const dialogRes = await remote.dialog.showOpenDialog(
    remote.getCurrentWindow(),
    {
      filters: [{ name: 'Bookmark file', extensions: ['html', 'jsonlz4'] }],
    },
  );

  try {
    const file = await promises.readFile(dialogRes.filePaths[0], 'utf8');
    const res = parse(file);

    addImported(res);
  } catch (err) {
    console.error(err);
  }
};

const BookmarksList = observer(() => {
  const items = store.bookmarks.visibleItems;

  return (
    <Sections>
      <Content>
        <PathView>
          <PathItem onClick={onPathItemClick(null)} key={null}>
            Home
          </PathItem>
          {store.bookmarks.path.map(item => (
            <PathItem onClick={onPathItemClick(item)} key={item._id}>
              {getBookmarkTitle(item)}
            </PathItem>
          ))}
        </PathView>
        {!!items.length && (
          <BookmarkSection>
            {items.map(data => (
              <Bookmark data={data} key={data._id} />
            ))}
          </BookmarkSection>
        )}
      </Content>
    </Sections>
  );
});

export const Bookmarks = observer(() => {
  const { length } = store.bookmarks.selectedItems;

  return (
    <Container content="bookmarks" right>
      <Scrollable2 onScroll={onScroll} ref={scrollRef}>
        <NavigationDrawer
          title="Bookmarks"
          search
          onSearchInput={onInput}
          onBackClick={onBackClick}
        >
          <Tree />
          <div style={{ flex: 1 }} />
          <NavigationDrawer.Item
            icon={icons.newFolder}
            onClick={onNewFolderClick}
          >
            New folder
          </NavigationDrawer.Item>
          <NavigationDrawer.Item icon={icons.download} onClick={onImportClick}>
            Import
          </NavigationDrawer.Item>
        </NavigationDrawer>
        <BookmarksList />
        <SelectionDialog
          visible={length > 1}
          amount={length}
          onDeleteClick={onDeleteClick}
          onCancelClick={onCancelClick}
        />
        <ContextMenu
          style={{
            top: store.bookmarks.menuTop,
            left: store.bookmarks.menuLeft - 130,
          }}
          visible={store.bookmarks.menuVisible}
        >
          <ContextMenuItem
            onClick={onRemoveClick(store.bookmarks.currentBookmark)}
            icon={icons.trash}
            visible={store.bookmarks.path.length <= 0 || store.bookmarks.path[0].static !== 'pinned'}
          >
            Remove
          </ContextMenuItem>
          <ContextMenuItem
            onClick={onUnpinClick(store.bookmarks.currentBookmark)}
            visible={store.bookmarks.path.length > 0 && store.bookmarks.path[0].static === 'pinned'}
          >
            Unpin
          </ContextMenuItem>
        </ContextMenu>
      </Scrollable2>
    </Container>
  );
});
