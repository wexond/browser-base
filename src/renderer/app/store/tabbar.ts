import { observable } from 'mobx';

export class TabbarStore {
  @observable
  public scrollbarVisible: boolean = false;

  public lastScrollLeft: number = 0;
  public ref: HTMLDivElement;
}
