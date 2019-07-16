import { observable } from 'mobx';

export class AddBookmarkStore {
  @observable
  public visible = false;

  constructor() {
    requestAnimationFrame(() => {
      window.removeEventListener('mousedown', this.onWindowMouseDown);
      window.addEventListener('mousedown', this.onWindowMouseDown);
    })
  }

  public onWindowMouseDown = () => {
    this.visible = false;
  }
}
