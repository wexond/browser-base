import React from 'react';
import { observer } from 'mobx-react';

import store from '../../../store';
import Button from '../../../components/Button';
import Textfield from '../../../components/Textfield';
import { colors } from '../../../../defaults';
import { ButtonType } from '../../../../enums';
import {
  Root, Title, ButtonsContainer, Content,
} from './styles';

@observer
export default class Dialog extends React.Component {
  private onCancelClick = () => {
    store.keysDialogVisible = false;
  }

  public render() {
    return (
      <Root visible={store.keysDialogVisible}>
        <Title>Recording key combination</Title>
        <Content>
          <Textfield label="Combination" />
        </Content>
        <ButtonsContainer>
          <Button type={ButtonType.Text} foreground={colors.blue['500']} onClick={this.onCancelClick}>
            CANCEL
          </Button>
          <Button type={ButtonType.Text} foreground={colors.blue['500']}>
            OK
          </Button>
        </ButtonsContainer>
      </Root>
    );
  }
}
