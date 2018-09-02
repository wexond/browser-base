import { observable } from 'mobx';

import ContextMenu from '@/components/ContextMenu';

export class KeyBindingsMenuStore {
  @observable
  public x: number = 0;

  @observable
  public y: number = 0;

  @observable
  public visible: boolean = false;

  public ref: ContextMenu;
}
