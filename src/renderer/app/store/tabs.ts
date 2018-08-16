import { observable } from 'mobx';

export class TabsStore {
  @observable
  public isDragging: boolean = false;

  public lastMouseX: number = 0;
  public mouseStartX: number = 0;
  public tabStartX: number = 0;
  public dragDirection: 'left' | 'right' | '' = '';

  private rearrangeTabsTimer = {
    canReset: false,
    time: 0,
    interval: null as any,
  };

  constructor() {
    this.rearrangeTabsTimer.interval = setInterval(() => {
      // Set widths and positions for tabs 3 seconds after a tab was closed
      if (
        this.rearrangeTabsTimer.canReset &&
        this.rearrangeTabsTimer.time === 3
      ) {
        updateTabsBounds();
        this.rearrangeTabsTimer.canReset = false;
      }
      this.rearrangeTabsTimer.time++;
    }, 1000);
  }

  public resetRearrangeTabsTimer() {
    this.rearrangeTabsTimer.time = 0;
    this.rearrangeTabsTimer.canReset = true;
  }
}
