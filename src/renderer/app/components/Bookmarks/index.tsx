import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import { Container, Scrollable, Content, Back } from '../Overlay/style';
import { Button } from '~/renderer/components/Button';
import {
  LeftMenu,
  Header,
  Title,
  MenuItems,
  Sections,
  Search,
  Input,
  DeletionDialog,
  DeletionDialogLabel,
  BookmarkSection,
} from './style';
import Bookmark from '../Bookmark';

const scrollRef = React.createRef<HTMLDivElement>();

const onBackClick = () => {
  scrollRef.current.scrollTop = 0;
  store.bookmarks.resetLoadedItems();
  store.overlay.currentContent = 'default';
};

const preventHiding = (e: any) => {
  e.stopPropagation();
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
  e.stopPropagation();
  store.history.selectedItems = [];
};

const onDeleteClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  store.history.deleteSelected();
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

export const Bookmarks = observer(() => {
  return (
    <Container
      onClick={preventHiding}
      right
      visible={
        store.overlay.currentContent === 'bookmarks' && store.overlay.visible
      }
    >
      <Scrollable onScroll={onScroll} ref={scrollRef}>
        <LeftMenu>
          <Header>
            <Back onClick={onBackClick} />
            <Title>Bookmarks</Title>
          </Header>
          <Search>
            <Input placeholder="Search" onInput={onInput} />
          </Search>
          <MenuItems />
        </LeftMenu>
        {store.bookmarks.visibleItems.length > 0 && <BookmarksList />}
        <Dialog />
      </Scrollable>
    </Container>
  );
});
