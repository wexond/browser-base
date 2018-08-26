import React from 'react';
import { clipboard } from 'electron';
import { observer } from 'mobx-react';

import ContextMenu from '@components/ContextMenu';
import store from '@app/store';
import { saveKeyBindings } from '~/utils/key-bindings';

const defaultKeyBindings = require('../../../../../static/defaults/key-bindings.json');

@observer
export default class KeyBindingsMenu extends React.Component {
  public onCopyClick = (e: React.MouseEvent<any>) => {
    const { key } = store.keyBindingsStore.selected;
    clipboard.clear();
    clipboard.writeText(key);
    store.keyBindingsMenuStore.visible = false;
  };

  public onCopyCommandClick = () => {
    const { command } = store.keyBindingsStore.selected;
    clipboard.clear();
    clipboard.writeText(command);
    store.keyBindingsMenuStore.visible = false;
  };

  public onEditClick = () => {
    const selected = store.keyBindingsStore.selected;
    store.keyBindingsStore.editKeyBinding(selected);
    store.keyBindingsMenuStore.visible = false;
  };

  public onResetClick = () => {
    const selected = store.keyBindingsStore.selected;

    if (selected.isChanged) {
      for (const data of defaultKeyBindings) {
        if (data.command === selected.command) {
          selected.isChanged = false;
          selected.key = data.key;

          saveKeyBindings();
          break;
        }
      }
    }

    store.keyBindingsMenuStore.visible = false;
  };

  public render() {
    const selected = store.keyBindingsStore.selected;
    const isResetDisabled = selected && !selected.isChanged;

    return (
      <ContextMenu
        width={300}
        ref={(r: ContextMenu) => (store.keyBindingsMenuStore.ref = r)}
        onMouseDown={e => e.stopPropagation()}
        style={{
          position: 'absolute',
          left: store.keyBindingsMenuStore.x,
          top: store.keyBindingsMenuStore.y,
        }}
        visible={store.keyBindingsMenuStore.visible}
      >
        <ContextMenu.Item onClick={this.onCopyClick}>Copy</ContextMenu.Item>
        <ContextMenu.Item onClick={this.onCopyCommandClick}>
          Copy command
        </ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item onClick={this.onEditClick}>Edit</ContextMenu.Item>
        <ContextMenu.Item
          onClick={this.onResetClick}
          disabled={isResetDisabled}
        >
          Reset
        </ContextMenu.Item>
      </ContextMenu>
    );
  }
}
