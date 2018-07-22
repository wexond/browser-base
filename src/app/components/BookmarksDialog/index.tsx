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

  public onMouseDown = (e?: SyntheticEvent<any>) => {
    e.stopPropagation();
    this.textField.inputElement.blur();
  };

  public onDoneClick = () => {
    Store.bookmarksDialogVisible = false;
  };

  public onRemoveClick = () => {
    const selectedTab = Store.getSelectedTab();

    if (selectedTab.bookmarkId !== -1) {
      db.bookmarks.delete(selectedTab.bookmarkId);
      selectedTab.isSavedAsBookmark = false;
      selectedTab.bookmarkId = -1;

      Store.bookmarksDialogVisible = false;
    } else {
      console.error(selectedTab); // eslint-disable-line
    }
  };

  public render() {
    const visible = Store.bookmarksDialogVisible;

    return (
      <Root visible={visible} onMouseDown={this.onMouseDown}>
        <Title>New bookmark</Title>
        <Textfield ref={r => (this.textField = r)} label="Name" style={{ marginTop: 16 }} />
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
