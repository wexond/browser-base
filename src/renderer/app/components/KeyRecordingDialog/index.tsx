import React from 'react';
import mousetrap from 'mousetrap';
import { observer } from 'mobx-react';

import Button from '../../../components/Button';
import { Root, Title, ButtonsContainer, Content, KeyInput } from './styles';
import store from '@app/store';
import { commands } from '~/defaults/commands';
import { colors } from '~/defaults';

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
      e.key !== 'Control' &&
      e.key !== 'Alt' &&
      e.key !== 'Shift' &&
      e.key !== 'Alt' &&
      e.key !== 'Meta'
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
    store.keyBindingsStore.dialogVisible = false;
  };

  public onOKClick = () => {
    if (this.combination != null) {
      const selected = store.keyBindingsStore.selected;
      const combination = this.getCombination();

      mousetrap.unbind(selected.key);
      mousetrap.bind(combination, commands[selected.command]);

      selected.key = combination;
    }

    store.keyBindingsStore.dialogVisible = false;
  };

  public render() {
    return (
      <Root visible={store.keyBindingsStore.dialogVisible}>
        <Title>Recording key combination</Title>
        <Content>
          <KeyInput
            innerRef={r => (this.input = r)}
            onKeyDown={this.onKeyDown}
          />
        </Content>
        <ButtonsContainer>
          <Button
            text
            foreground={colors.blue['500']}
            onClick={this.onCancelClick}
          >
            CANCEL
          </Button>
          <Button text foreground={colors.blue['500']} onClick={this.onOKClick}>
            OK
          </Button>
        </ButtonsContainer>
      </Root>
    );
  }
}
