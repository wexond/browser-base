import { observer } from 'mobx-react';
import React from 'react';
import { ButtonsContainer, Root, Title } from './styles';
import Textfield from '@components/Textfield';
import Dropdown from '@components/Dropdown';
import store from '@app/store';
import { Bookmark } from '~/interfaces';
import { colors } from '~/defaults';
import Button from '@components/Button';

@observer
export default class BookmarksDialog extends React.Component {
  private textField: Textfield;

  private dropdown: Dropdown;

  private dropDownClicked: boolean = false;

  private bookmarkFolder: number = -1;

  private bookmark: Bookmark;

  public show = (bookmark: Bookmark) => {
    if (bookmark != null && bookmark.title != null) {
      store.bookmarksStore.dialogVisible = !store.bookmarksStore.dialogVisible;
      store.tabsStore.getSelectedTab().isBookmarked = true;

      this.textField.setValue(bookmark.title);
      this.textField.inputElement.select();

      this.bookmark = bookmark;

      const item = this.dropdown.items.find(
        x => x.props.value === bookmark.parent,
      );

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
      this.dropdown.ripple.fadeOut();
      this.dropDownClicked = false;
    }
  };

  public onDropdownMouseUp = (e?: React.MouseEvent<any>) => {
    this.dropDownClicked = true;
  };

  public onRemoveClick = async () => {
    if (this.bookmark) {
      store.bookmarksStore.removeItem(this.bookmark);
      store.tabsStore.getSelectedTab().isBookmarked = false;
      store.bookmarksStore.dialogVisible = false;
    }
  };

  public onDoneClick = async () => {
    const name = this.textField.getValue();

    // TODO: nedb
    /*await database.bookmarks
      .where('id')
      .equals(this.bookmark.id)
      .modify({
        title: name,
        parent: this.bookmarkFolder,
      });

    const item = store.bookmarks.find(x => x.id === this.bookmark.id);

    item.title = name;
    item.parent = this.bookmarkFolder;*/

    store.bookmarksStore.dialogVisible = false;
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
    const visible = store.bookmarksStore.dialogVisible;

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
          {store.bookmarksStore.bookmarks
            .filter(x => x.type === 'folder')
            .map((item: Bookmark, key: any) => (
              <Dropdown.Item value={item._id} key={key}>
                {item.title}
              </Dropdown.Item>
            ))}
        </Dropdown>
        <ButtonsContainer>
          <Button
            outlined
            foreground={colors.blue['500']}
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
