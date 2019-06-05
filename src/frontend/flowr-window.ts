import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { Store } from './src/store'
import { Player } from './src/player'

export class FlowrWindow extends BrowserWindow {

  private resizeTimeout?: number
  private player: Player

  constructor(private store: Store, options?: BrowserWindowConstructorOptions) {
    super(options);
    this.player = new Player(this.store)

    this.on('close', () => {
      this.player.close()
    })
    this.on('maximize',  () => {
      this.store.set('isMaximized', true)
    })

    this.on('unmaximize', () => {
      this.store.set('isMaximized', false)
      const winBounds = this.store.get('windowBounds')
      const width =  parseInt(winBounds.width, 10)
      const height = (width - 16) * 9 / 16

      this.setSize(winBounds.width, height + 40)
    })

    this.on('resize', () => {

      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout)
      }
      this.resizeTimeout = setTimeout(() => {
        const size = this.getSize()
        const width = size[0]
        let height = size[1]
        if (!store.get('isMaximized')) {
          height =  (size[0] - 16) * 9 / 16
          this.setSize(width, height + 40)
          store.set('windowBounds', { width, height })

        }
      }, 150)
    })
  }

}
