import { observable } from 'mobx';
import { KeyBinding } from 'interfaces';
import KeyRecordingDialog from '../components/KeyRecordingDialog';

export class KeyBindingsStore {
  @observable
  public keyBindings: KeyBinding[] = [];

  @observable
  public selected: KeyBinding;

  @observable
  public dialogVisible: boolean = false;

  public dialog: KeyRecordingDialog;
}
