import { observer } from 'mobx-react';
import React, { Component, SyntheticEvent } from 'react';
import Store from '../../store';
import { ButtonType } from '../../../shared/enums';
import Textfield from '../../../shared/components/Textfield';
import Button from '../../../shared/components/Button';
import colors from '../../../shared/defaults/colors';
import db from '../../../shared/models/app-database';
import { removeItem } from '../../../menu/bookmarks/utils';
import Dropdown from '../../../shared/components/Dropdown';
import { Root, Title, ButtonsContainer } from './styles';
import BookmarkItem from '../../../shared/models/bookmark-item';

@observer
export default class BookmarksDialog extends Component {
  private textField: Textfield;

  private dropDown: Dropdown;

  private bookmarkFolder: any = null;

  public onLoad = () => {
    const bookmark = Store.getSelectedTab().bookmark;

    if (bookmark != null && bookmark.title != null) {
      this.textField.setValue(bookmark.title);
      this.textField.inputElement.select();

      if (bookmark.id !== -1) {
        const items = this.dropDown.items.filter(
          r => r.props.data != null && r.props.data.id === bookmark.parent,
        );

        if (items.length !== 0) {
          if (items.length > 1) {
            console.warn(bookmark, this.dropDown); // eslint-disable-line
          }

          this.dropDown.setState({
            selectedItem: items[0],
          });
        }
      }
    }
  };

  public onMouseUp = (e?: SyntheticEvent<any>) => {
    e.stopPropagation();
    this.textField.inputElement.blur();
  };

  public onRemoveClick = async () => {
    const selectedTab = Store.getSelectedTab();

    if (selectedTab.bookmark) {
      await removeItem(selectedTab.bookmark.id);

      selectedTab.bookmark = null;
      Store.bookmarksDialogVisible = false;
    } else {
      console.error(selectedTab); // eslint-disable-line
    }
  };

  public onDoneClick = async () => {
    const bookmark = Store.getSelectedTab().bookmark;
    const name = this.textField.getValue();
    const parent = this.bookmarkFolder == null ? -1 : this.bookmarkFolder.id;

    await db.bookmarks
      .where('id')
      .equals(bookmark.id)
      .modify({
        title: name,
        parent,
      });

    bookmark.title = name;
    Store.bookmarksDialogVisible = false;
  };

  public onTextfieldKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.onDoneClick();
    }
  };

  public onDropdownChange = (data: any) => {
    this.bookmarkFolder = data;
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
          ref={r => (this.dropDown = r)}
          onChange={this.onDropdownChange}
          style={dropDownStyle}
        >
          <Dropdown.Item>Home</Dropdown.Item>
          {Store.getBookmarkFolders().map((item: BookmarkItem, key: any) => (
            <Dropdown.Item data={item} key={key}>
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
