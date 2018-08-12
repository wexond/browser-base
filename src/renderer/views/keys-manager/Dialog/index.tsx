import React from 'react';
import { observer } from 'mobx-react';

import store from '../../../store';
import Button from '../../../components/Button';
import { colors } from '../../../../defaults';
import { ButtonType } from '../../../../enums';
import {
  Root, Title, ButtonsContainer, Content, KeyInput,
} from './styles';

@observer
export default class Dialog extends React.Component {
  public onCancelClick = () => {
    store.keyRecordingDialogVisible = false;
  };

  public onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.key);
  };

  public render() {
    return (
      <Root visible={store.keyRecordingDialogVisible}>
        <Title>Recording key combination</Title>
        <Content>
          <KeyInput onKeyDown={this.onKeyDown} />
        </Content>
        <ButtonsContainer>
          <Button
            type={ButtonType.Text}
            foreground={colors.blue['500']}
            onClick={this.onCancelClick}
          >
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
