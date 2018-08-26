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
import { getContextMenuPos } from '~/utils/context-menu';

@observer
export default class KeyboardShortcuts extends React.Component {
  public onChipClick = (keyBinding: KeyBinding) => {
    store.keyBindingsStore.editKeyBinding(keyBinding);
  };

  public onContextMenu = (e: any, binding: KeyBinding) => {
    // Get position
    const pos = getContextMenuPos(store.keyBindingsMenuStore.ref);

    // Set the new position.
    store.keyBindingsMenuStore.x = pos.x;
    store.keyBindingsMenuStore.y = pos.y;

    store.keyBindingsStore.selected = binding;
    store.keyBindingsMenuStore.visible = true;
  };

  public render() {
    const keyboardShortcuts = store.dictionary.keyboardShortcuts;

    return (
      <PageContent>
        <Container>
          <Table>
            <thead>
              <HeadRow>
                <HeadItem>{keyboardShortcuts.command}</HeadItem>
                <HeadItem>{keyboardShortcuts.keyBinding}</HeadItem>
                <HeadItem>{keyboardShortcuts.source}</HeadItem>
              </HeadRow>
            </thead>
            <tbody>
              {store.keyBindingsStore.keyBindings.map((data, key) => (
                <BodyRow
                  key={key}
                  onContextMenu={e => this.onContextMenu(e, data)}
                >
                  <BodyItem>
                    {store.dictionary.keyCommands[data.command]}
                  </BodyItem>
                  <BodyItem>
                    {typeof data.key === 'string' && (
                      <Chip keyBinding={data} onClick={this.onChipClick} />
                    )}
                  </BodyItem>
                  <BodyItem>
                    {data.isChanged
                      ? keyboardShortcuts.user
                      : keyboardShortcuts.default}
                  </BodyItem>
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
