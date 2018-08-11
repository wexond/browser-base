import React from 'react';

import Button from '../../../components/Button';
import Textfield from '../../../components/Textfield';
import { colors } from '../../../../defaults';
import { ButtonType } from '../../../../enums';
import {
  Root, Title, ButtonsContainer, Content,
} from './styles';

export default class Dialog extends React.Component {
  public render() {
    return (
      <Root>
        <Title>Recording key combination</Title>
        <Content>
          <Textfield label="Combination" />
        </Content>
        <ButtonsContainer>
          <Button type={ButtonType.Text} foreground={colors.blue['500']}>
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
