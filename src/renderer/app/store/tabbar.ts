import { observable } from 'mobx';
import { TOOLBAR_BUTTON_WIDTH } from '~/constants';
import HorizontalScrollbar from '@app/components/HorizontalScrollbar';

export class TabbarStore {
  @observable
  public scrollbarVisible: boolean = false;

  public lastScrollLeft: number = 0;
  public ref: HTMLDivElement;
  public scrollbarRef: HorizontalScrollbar;

  public getWidth() {
    if (this.ref) return this.ref.offsetWidth - TOOLBAR_BUTTON_WIDTH;
    return null;
  }
}
