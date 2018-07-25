import { observer } from 'mobx-react';
import React, { Component, SyntheticEvent } from 'react';
import Store from '../../store';
import { ButtonType } from '../../../shared/enums';
import Textfield from '../../../shared/components/Textfield';
import Button from '../../../shared/components/Button';
import colors from '../../../shared/defaults/colors';
import db from '../../../shared/models/app-database';
import { removeItem, getBookmarkFolders } from '../../../menu/bookmarks/utils';
import Dropdown from '../../../shared/components/Dropdown';
import { Root, Title, ButtonsContainer } from './styles';
import BookmarkItem from '../../../shared/models/bookmark-item';

@observer
export default class BookmarksDialog extends Component {
  private textField: Textfield;

  private dropdown: Dropdown;

  private bookmarkFolderID: number;

  private bookmark: BookmarkItem;

  public show = (bookmark: BookmarkItem) => {
    if (bookmark != null && bookmark.title != null) {
      Store.bookmarksDialogVisible = !Store.bookmarksDialogVisible;
      Store.isStarred = true;

      this.textField.setValue(bookmark.title);
      this.textField.inputElement.select();

      this.bookmark = bookmark;

      const item = this.dropdown.items.find(x => x.props.id === bookmark.parent);

      if (item) {
        this.dropdown.setState({
          selectedItem: item,
        });
      }
    }
  };

  public onMouseUp = (e?: SyntheticEvent<any>) => {
    e.stopPropagation();
    this.textField.inputElement.blur();
  };

  public onRemoveClick = async () => {
    if (this.bookmark) {
      await removeItem(this.bookmark.id, 'item');
      Store.isStarred = false;
      Store.bookmarksDialogVisible = false;
    }
  };

  public onDoneClick = async () => {
    const name = this.textField.getValue();
    const parent = this.bookmarkFolderID == null ? -1 : this.bookmarkFolderID;

    await db.bookmarks
      .where('id')
      .equals(this.bookmark.id)
      .modify({
        title: name,
        parent,
      });

    const item = Store.bookmarks.find(x => x.id === this.bookmark.id);

    item.title = name;
    item.parent = parent;

    Store.bookmarksDialogVisible = false;
  };

  public onTextfieldKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.onDoneClick();
    }
  };

  public onDropdownChange = (id: number) => {
    this.bookmarkFolderID = id;
  };

  public render() {
    const visible = Store.bookmarksDialogVisible;

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
          style={dropDownStyle}
        >
          <Dropdown.Item>Home</Dropdown.Item>
          {getBookmarkFolders().map((item: BookmarkItem, key: any) => (
            <Dropdown.Item id={item.id} key={key}>
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
