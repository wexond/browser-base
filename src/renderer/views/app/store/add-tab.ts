import store from '.';
import { observable } from 'mobx';

export class AddTabStore {
  @observable
  public left = 0;

  public ref: HTMLDivElement;

  public setLeft(left: number, animation: boolean) {
    this.left = left;
  }
}
