import { observer } from 'mobx-react';
import React from 'react';

import Chip from '../Chip';
import KeyRecordingDialog from '../KeyRecordingDialog';
import {
  Container,
  Table,
  HeadRow,
  HeadItem,
  BodyRow,
  BodyItem,
} from './styles';
import store from '@app/store';
import { KeyBinding } from '~/interfaces';
import { PageContent } from '../Menu/styles';

@observer
export default class KeyboardShortcuts extends React.Component {
  public onChipClick = (keyBinding: KeyBinding) => {
    store.keyBindingsStore.dialogVisible = true;
    store.keyBindingsStore.dialog.input.value = keyBinding.key;
    store.keyBindingsStore.dialog.combination = null;
    store.keyBindingsStore.selected = keyBinding;
  };

  public render() {
    return (
      <PageContent>
        <Container>
          <Table>
            <thead>
              <HeadRow>
                <HeadItem>Command</HeadItem>
                <HeadItem>Keybinding</HeadItem>
                <HeadItem>Source</HeadItem>
              </HeadRow>
            </thead>
            <tbody>
              {store.keyBindingsStore.keyBindings.map((data, key) => (
                <BodyRow key={key}>
                  <BodyItem>
                    {store.dictionary.keyCommands[data.command]}
                  </BodyItem>
                  <BodyItem>
                    {typeof data.key === 'string' && (
                      <Chip keyBinding={data} onClick={this.onChipClick} />
                    )}
                  </BodyItem>
                  <BodyItem>{data.isChanged ? 'User' : 'Default'}</BodyItem>
                </BodyRow>
              ))}
            </tbody>
          </Table>
          <KeyRecordingDialog ref={r => (store.keyBindingsStore.dialog = r)} />
        </Container>
      </PageContent>
    );
  }
}
