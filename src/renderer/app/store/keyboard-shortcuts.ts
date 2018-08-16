import { observable } from 'mobx';

export class KeyboardShortcutsStore {
  @observable
  public keyBindings: KeyBinding[] = [];

  @observable
  public selectedKeyBinding: KeyBinding;

  @observable
  public keyRecordingDialogVisible: boolean = false;

  public keyRecordingDialog: KeyRecordingDialog;
}
