import { observable } from 'mobx';

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

  public url: string = '';

  public width: number = 0;

  public left: number = 0;

  public ref: HTMLDivElement;

  public isClosing: boolean = false;

  constructor(workspaceId: number) {
    this.workspaceId = workspaceId;
  }
}
