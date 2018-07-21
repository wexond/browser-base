import { observer } from 'mobx-react';
import React, { Component, SyntheticEvent } from 'react';
import Store from '../../store';
import { ButtonType } from '../../../shared/enums';
import Textfield from '../../../shared/components/Textfield';
import Button from '../../../shared/components/Button';
import colors from '../../../shared/defaults/colors';
import { Root, Title, ButtonsContainer } from './styles';

@observer
export default class AddressBar extends Component {
  public render() {
    return (
      <Root>
        <Title>New bookmark</Title>
        <Textfield label="Name" style={{ marginTop: 16 }} />
        <ButtonsContainer>
          <Button foreground={colors.blue['500']} type={ButtonType.Outlined}>
            REMOVE
          </Button>
          <Button>DONE</Button>
        </ButtonsContainer>
      </Root>
    );
  }
}
