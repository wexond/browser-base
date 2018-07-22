import { observer } from 'mobx-react';
import React, { Component, SyntheticEvent } from 'react';
import Store from '../../store';
import { ButtonType } from '../../../shared/enums';
import Textfield from '../../../shared/components/Textfield';
import Button from '../../../shared/components/Button';
import colors from '../../../shared/defaults/colors';
import { Root, Title, ButtonsContainer } from './styles';

export interface IProps {
  visible: boolean;
}

@observer
export default class BookmarksDialog extends Component<IProps, {}> {
  private textField: Textfield;

  public onMouseDown = (e?: SyntheticEvent<any>) => {
    e.stopPropagation();
    this.textField.inputElement.blur();
  };

  public onDoneClick = () => {
    Store.bookmarksDialogVisible = false;
  };

  public render() {
    const { visible } = this.props;

    return (
      <Root visible={visible} onMouseDown={this.onMouseDown}>
        <Title>New bookmark</Title>
        <Textfield ref={r => (this.textField = r)} label="Name" style={{ marginTop: 16 }} />
        <ButtonsContainer>
          <Button foreground={colors.blue['500']} type={ButtonType.Outlined}>
            REMOVE
          </Button>
          <Button onClick={this.onDoneClick}>DONE</Button>
        </ButtonsContainer>
      </Root>
    );
  }
}
