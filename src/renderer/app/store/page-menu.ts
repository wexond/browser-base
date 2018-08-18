import { observable } from 'mobx';
import { PageMenuMode } from '~/enums';
import ContextMenu from '../../components/ContextMenu';

export class PageMenuStore {
  @observable
  public x: number = 0;

  @observable
  public y: number = 0;

  @observable
  public mode: PageMenuMode = PageMenuMode.Normal;

  @observable
  public visible: boolean = false;

  public params: Electron.ContextMenuParams;
  public ref: ContextMenu;
}
