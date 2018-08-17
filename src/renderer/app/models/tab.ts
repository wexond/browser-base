import { observable } from 'mobx';
import { TabGroup } from './tab-group';
import store from '../store';

let id = 0;

export class Tab {
  @observable
  public id: number = id++;

  @observable
  public workspaceId: number;

  @observable
  public isDragging: boolean = false;

  @observable
  public title: string = 'New tab';

  @observable
  public loading: boolean = false;

  @observable
  public favicon: string = '';

  @observable
  public hovered: boolean = false;

  @observable
  public isBookmarked: boolean = false;

  public url: string = '';
  public width: number = 0;
  public left: number = 0;
  public isClosing: boolean = false;
  public tabGroup: TabGroup;

  public ref: HTMLDivElement;

  constructor(tabGroup: TabGroup) {
    this.tabGroup = tabGroup;
  }

  public select() {
    if (!this.isClosing) {
      this.tabGroup.selectedTab = this.id;

      store.extensionsStore.emitExtensionEvent('tabs', 'onActivated', {
        tabId: this.id,
        windowId: 0,
      });
    }
  }
}
