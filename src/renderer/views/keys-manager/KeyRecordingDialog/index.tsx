import React from 'react';
import mousetrap from 'mousetrap';
import { observer } from 'mobx-react';

import store from '../../../store';
import Button from '../../../components/Button';
import { colors, Commands } from '../../../../defaults';
import { ButtonType } from '../../../../enums';
import {
  Root, Title, ButtonsContainer, Content, KeyInput,
} from './styles';
import { KeyBinding } from '../../../../interfaces';

@observer
export default class KeyRecordingDialog extends React.Component {
  public input: HTMLInputElement;

  public combination = {
    key: '',
    ctrl: false,
    alt: false,
    shift: false,
    meta: false,
  };

  public onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (
      e.key !== 'Control'
      && e.key !== 'Alt'
      && e.key !== 'Shift'
      && e.key !== 'Alt'
      && e.key !== 'Meta'
    ) {
      this.combination = {
        key: e.key,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        shift: e.shiftKey,
        meta: e.metaKey,
      };

      e.currentTarget.value = this.getCombination();
    }
  };

  public getCombination = () => {
    let text = '';

    if (this.combination.ctrl) text += 'ctrl+';
    if (this.combination.alt) text += 'alt+';
    if (this.combination.shift) text += 'shift+';
    if (this.combination.meta) text += 'meta+';
    if (this.combination.key !== '') text += this.combination.key;

    return text;
  };

  public onCancelClick = () => {
    store.keyRecordingDialogVisible = false;
  };

  public onOKClick = () => {
    if (this.combination != null) {
      const selected = store.selectedKeyBinding;
      const combination = this.getCombination();

      mousetrap.unbind(selected.key);
      mousetrap.bind(combination, Commands[selected.command]);

      selected.key = combination;
    }

    store.keyRecordingDialogVisible = false;
  };

  public render() {
    return (
      <Root visible={store.keyRecordingDialogVisible}>
        <Title>Recording key combination</Title>
        <Content>
          <KeyInput innerRef={r => (this.input = r)} onKeyDown={this.onKeyDown} />
        </Content>
        <ButtonsContainer>
          <Button
            type={ButtonType.Text}
            foreground={colors.blue['500']}
            onClick={this.onCancelClick}
          >
            CANCEL
          </Button>
          <Button type={ButtonType.Text} foreground={colors.blue['500']} onClick={this.onOKClick}>
            OK
          </Button>
        </ButtonsContainer>
      </Root>
    );
  }
}
