import * as React from 'react';
import { observer } from 'mobx-react';

import store from '~/renderer/views/app/store';
import { IBookmark } from '~/interfaces';
import { Sections, BookmarkSection } from './style';
import { Content, Container, Scrollable } from '../../style';
import { preventHiding } from '../..';
import { NavigationDrawer } from '../../components/NavigationDrawer';
import { SelectionDialog } from '../../components/SelectionDialog';
import { ContextMenu, ContextMenuItem } from '../../components/ContextMenu';
import { icons } from '~/renderer/constants';
import { Bookmark } from './Bookmark';

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

const onCancelClick = (e: React.MouseEvent) => {
  store.bookmarks.selectedItems = [];
};

const onDeleteClick = (e: React.MouseEvent) => {
  store.bookmarks.deleteSelected();
};

const onRemoveClick = (item: IBookmark) => () => {
  store.bookmarks.removeItem(item._id);
};

const onClick = (e: React.MouseEvent) => {
  preventHiding(e);
  store.bookmarks.menuVisible = false;
};

const BookmarksList = observer(() => {
  return (
    <Sections>
      <Content>
        <BookmarkSection style={{ marginTop: 56 }}>
          {store.bookmarks.visibleItems.map(data => (
            <Bookmark data={data} key={data._id} />
          ))}
        </BookmarkSection>
      </Content>
    </Sections>
  );
});

export const Bookmarks = observer(() => {
  const { length } = store.bookmarks.selectedItems;

  return (
    <Container
      onClick={onClick}
      right
      visible={
        store.overlay.currentContent === 'bookmarks' && store.overlay.visible
      }
    >
      <Scrollable onScroll={onScroll} ref={scrollRef}>
        <NavigationDrawer
          title="Bookmarks"
          search
          onSearchInput={onInput}
          onBackClick={onBackClick}
        />
        {store.bookmarks.visibleItems.length > 0 && <BookmarksList />}
        <SelectionDialog
          visible={length > 0}
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
          >
            Remove
          </ContextMenuItem>
        </ContextMenu>
      </Scrollable>
    </Container>
  );
});
