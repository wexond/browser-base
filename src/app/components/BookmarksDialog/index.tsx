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
export default class AddressBar extends Component<IProps, {}> {
  public render() {
    const { visible } = this.props;

    return (
      <Root visible={visible}>
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
