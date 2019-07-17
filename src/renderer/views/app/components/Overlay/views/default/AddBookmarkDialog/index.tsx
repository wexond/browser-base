import * as React from 'react';
import { observer } from 'mobx-react';

import store from '~/renderer/views/app/store';
import { Dropdown } from '~/renderer/components/Dropdown';
import { Input } from '~/renderer/components/Input';
import { getBookmarkTitle } from '~/renderer/views/app/utils/bookmarks';
import { Button } from '~/renderer/components/Button';
import { colors } from '~/renderer/constants';
import { StyledDialog, Title, Row, Label, Buttons } from './styles';

const onMouseDown = (e: React.MouseEvent) => {
  e.stopPropagation();
};

const onDone = () => {
  store.addBookmark.hide();
};

const onChange = (value: any) => {
  store.overlay.bookmark.parent = value;
};

const onRemove = () => {
  store.bookmarks.removeItem(store.overlay.bookmark._id);
  store.addBookmark.hide();
};

export default observer(() => {
  console.log(store.bookmarks.folders);

  return (
    <StyledDialog visible={store.addBookmark.visible} onMouseDown={onMouseDown}>
      <Title>Add bookmark</Title>
      <Row>
        <Label>Name</Label>
        <Input ref={store.addBookmark.titleRef} className="textfield" />
      </Row>
      <Row>
        <Label>Folder</Label>
        <Dropdown ref={store.addBookmark.dropdownRef} onChange={onChange}>
          {store.bookmarks.folders.map(item => (
            <Dropdown.Item key={item._id} value={item._id}>
              {getBookmarkTitle(item)}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </Row>
      <Buttons>
        <Button onClick={onDone}>DONE</Button>
        <Button
          onClick={onRemove}
          type="outlined"
          foreground={colors.blue['500']}
        >
          REMOVE
        </Button>
      </Buttons>
    </StyledDialog>
  );
});
