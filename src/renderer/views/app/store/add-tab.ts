import store from '.';
import { observable } from 'mobx';
import { animateTab } from '../utils/tabs';

export class AddTabStore {
  public left = 0;

  public ref: HTMLDivElement;

  public setLeft(left: number, animation: boolean) {
    animateTab('translateX', left, this.ref, animation);
    this.left = left;
  }
}
