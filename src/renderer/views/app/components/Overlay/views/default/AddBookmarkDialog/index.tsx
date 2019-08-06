import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '~/renderer/views/app/store';
import { Dropdown } from '~/renderer/components/Dropdown';
import { Input } from '~/renderer/components/Input';
import { getBookmarkTitle } from '~/renderer/views/app/utils/bookmarks';
import { Button } from '~/renderer/components/Button';
import { StyledDialog, Title, Row, Label, Buttons } from './styles';

const onMouseDown = (e: React.MouseEvent) => {
  e.stopPropagation();
};

const onDone = () => {
  store.addBookmark.hide();
};

const onChange = (parent: string) => {
  store.bookmarks.updateItem(store.overlay.bookmark._id, {
    parent,
  });
};

const onRemove = () => {
  store.bookmarks.removeItem(store.overlay.bookmark._id);
  store.addBookmark.hide();
};

const onBlur = () => {
  const input = store.addBookmark.titleRef.current;

  store.bookmarks.updateItem(store.overlay.bookmark._id, {
    title: input.value,
  });
};

/*        <Dropdown ref={store.addBookmark.dropdownRef} onChange={onChange}>
          {store.bookmarks.folders.map(item => (
            <Dropdown.Item key={item._id}>
              {getBookmarkTitle(item)}
            </Dropdown.Item>
          ))}
        </Dropdown>
        */

export default observer(() => {
  return (
    <StyledDialog visible={store.addBookmark.visible} onMouseDown={onMouseDown}>
      <Title>Add bookmark</Title>
      <Row>
        <Label>Name</Label>
        <Input
          className="textfield"
          ref={store.addBookmark.titleRef}
          onBlur={onBlur}
        />
      </Row>
      <Row>
        <Label>Folder</Label>

      </Row>
      <Buttons>
        <Button onClick={onDone}>Done</Button>
        <Button
          onClick={onRemove}
          background={
            store.theme['overlay.foreground'] === 'light'
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.08)'
          }
          foreground={
            store.theme['overlay.foreground'] === 'light' ? 'white' : 'black'
          }
        >
          Remove
        </Button>
      </Buttons>
    </StyledDialog>
  );
});
