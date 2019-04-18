import { windowManager, Window } from 'node-window-manager';
import mouseEvents from 'mouse-hooks';
import { appWindow } from '..';

export class ProcessWindow extends Window {
  public resizable = false;
  public maximizable = false;
  public minimizable = false;

  public lastTitle: string;

  public opacity: number;

  public lastBounds: any;
  public initialBounds: any;

  constructor(handle: number) {
    super(handle);

    this.lastBounds = this.getBounds();
    this.initialBounds = this.getBounds();
  }

  public detach() {
    this.setParent(null);

    mouseEvents.once('mouse-up', () => {
      setTimeout(() => {
        this.setBounds({
          width: this.initialBounds.width,
          height: this.initialBounds.height,
        });

        appWindow.webContents.send('remove-tab', this.handle);
      }, 50);
    });
  }
}
