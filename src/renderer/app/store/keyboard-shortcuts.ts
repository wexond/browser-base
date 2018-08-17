import { observable } from 'mobx';
import { KeyBinding } from 'interfaces';
import KeyRecordingDialog from '../components/KeyRecordingDialog';

export class KeyboardShortcutsStore {
  @observable
  public keyBindings: KeyBinding[] = [];

  @observable
  public selectedKeyBinding: KeyBinding;

  @observable
  public keyRecordingDialogVisible: boolean = false;

  public keyRecordingDialog: KeyRecordingDialog;
}
