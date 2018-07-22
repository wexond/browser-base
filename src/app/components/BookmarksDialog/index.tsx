import { observer } from 'mobx-react';
import React, { Component, SyntheticEvent } from 'react';
import Store from '../../store';
import { ButtonType } from '../../../shared/enums';
import Textfield from '../../../shared/components/Textfield';
import Button from '../../../shared/components/Button';
import colors from '../../../shared/defaults/colors';
import db from '../../../shared/models/app-database';
import { Root, Title, ButtonsContainer } from './styles';

@observer
export default class BookmarksDialog extends Component {
  private textField: Textfield;

  public onLoad = () => {
    const bookmark = Store.getSelectedTab().bookmark;

    if (bookmark != null && bookmark.title != null) {
      this.textField.setValue(bookmark.title);
      this.textField.inputElement.select();
    }
  };

  public onMouseDown = (e?: SyntheticEvent<any>) => {
    e.stopPropagation();
    this.textField.inputElement.blur();
  };

  public onRemoveClick = () => {
    const selectedTab = Store.getSelectedTab();

    if (selectedTab.bookmark) {
      db.bookmarks.delete(selectedTab.bookmark.id);

      selectedTab.bookmark = null;
      Store.bookmarksDialogVisible = false;
    } else {
      console.error(selectedTab); // eslint-disable-line
    }
  };

  public onDoneClick = async () => {
    const bookmark = Store.getSelectedTab().bookmark;
    const name = this.textField.getValue();

    if (name !== bookmark.title) {
      await db.bookmarks
        .where('url')
        .equals(bookmark.url)
        .modify({
          title: name,
        });

      bookmark.title = name;
    }

    Store.bookmarksDialogVisible = false;
  };

  public onTextfieldKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.onDoneClick();
    }
  };

  public render() {
    const visible = Store.bookmarksDialogVisible;

    return (
      <Root visible={visible} onMouseDown={this.onMouseDown}>
        <Title>New bookmark</Title>
        <Textfield
          ref={r => (this.textField = r)}
          label="Name"
          onKeyPress={this.onTextfieldKeyPress}
          style={{ marginTop: 16 }}
        />
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
