import { observer } from 'mobx-react';
import React from 'react';
import { Root, Title, ButtonsContainer } from './styles';

import Textfield from '../../../components/Textfield';
import Dropdown from '../../../components/Dropdown';
import store from '../../../store';
import database from '../../../../database';
import Button from '../../../components/Button';
import { ButtonType } from '../../../../enums';
import { BookmarkItem } from '../../../../interfaces';
import { removeItem, getBookmarkFolders } from '../../../../utils';
import { colors } from '../../../../defaults';

@observer
export default class BookmarksDialog extends React.Component {
  private textField: Textfield;

  private dropdown: Dropdown;

  private dropDownClicked: boolean = false;

  private bookmarkFolder: number = -1;

  private bookmark: BookmarkItem;

  public show = (bookmark: BookmarkItem) => {
    if (bookmark != null && bookmark.title != null) {
      store.bookmarkDialogVisible = !store.bookmarkDialogVisible;
      store.isBookmarked = true;

      this.textField.setValue(bookmark.title);
      this.textField.inputElement.select();

      this.bookmark = bookmark;

      const item = this.dropdown.items.find(x => x.props.value === bookmark.parent);

      if (item) {
        this.dropdown.setState({
          selectedItem: item.props.id,
        });
      }
    }
  };

  public onMouseUp = (e?: React.MouseEvent<any>) => {
    e.stopPropagation();
    this.textField.inputElement.blur();

    if (this.dropDownClicked) {
      this.dropdown.ripples.removeRipples();
      this.dropDownClicked = false;
    }
  };

  public onDropdownMouseUp = (e?: React.MouseEvent<any>) => {
    e.preventDefault();
    this.dropDownClicked = true;
  };

  public onRemoveClick = async () => {
    if (this.bookmark) {
      await removeItem(this.bookmark.id, 'item');
      store.isBookmarked = false;
      store.bookmarkDialogVisible = false;
    }
  };

  public onDoneClick = async () => {
    const name = this.textField.getValue();

    await database.bookmarks
      .where('id')
      .equals(this.bookmark.id)
      .modify({
        title: name,
        parent: this.bookmarkFolder,
      });

    const item = store.bookmarks.find(x => x.id === this.bookmark.id);

    item.title = name;
    item.parent = this.bookmarkFolder;

    store.bookmarkDialogVisible = false;
  };

  public onTextfieldKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.onDoneClick();
    }
  };

  public onDropdownChange = (id: number) => {
    this.bookmarkFolder = id;
  };

  public render() {
    const visible = store.bookmarkDialogVisible;

    const dropDownStyle = {
      width: '100%',
      marginTop: 24,
      zIndex: 1,
    };

    return (
      <Root visible={visible} onMouseUp={this.onMouseUp}>
        <Title>New bookmark</Title>
        <Textfield
          ref={r => (this.textField = r)}
          label="Name"
          onKeyPress={this.onTextfieldKeyPress}
          style={{ marginTop: 16 }}
        />
        <Dropdown
          ref={r => (this.dropdown = r)}
          onChange={this.onDropdownChange}
          onMouseUp={this.onDropdownMouseUp}
          style={dropDownStyle}
        >
          <Dropdown.Item value={-1}>Home</Dropdown.Item>
          {getBookmarkFolders().map((item: BookmarkItem, key: any) => (
            <Dropdown.Item value={item.id} key={key}>
              {item.title}
            </Dropdown.Item>
          ))}
        </Dropdown>
        <ButtonsContainer>
          <Button
            foreground={colors.blue['500']}
            type={ButtonType.Outlined}
            onClick={this.onRemoveClick}
          >
            REMOVE
          </Button>
          <Button onClick={this.onDoneClick}>DONE</Button>
        </ButtonsContainer>
      </Root>
    );
  }
}
