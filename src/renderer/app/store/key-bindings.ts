import { observable } from 'mobx';
import { KeyBinding } from '~/interfaces';
import KeyRecordingDialog from '../components/KeyRecordingDialog';

export class KeyBindingsStore {
  @observable
  public keyBindings: KeyBinding[] = [];

  @observable
  public selected: KeyBinding;

  @observable
  public dialogVisible: boolean = false;

  public dialog: KeyRecordingDialog;

  public editKeyBinding(keyBinding: KeyBinding) {
    this.dialogVisible = true;

    this.dialog.combination = null;
    this.dialog.input.value = keyBinding.key;
    this.dialog.input.focus();

    this.selected = keyBinding;
  }
}
