import { observable, observe, intercept } from 'mobx'
import App from "./components"

export default new class Store {
  @observable tabGroups: Array<any> = []
  @observable addTabLeft: number = 0
  @observable selectedTab: number = -1
  @observable tabDragData = {}
  @observable tabAnimateLeft: boolean = true
  @observable tabAnimateWidth: boolean = true

  @observable foreground: string = 'black'
  @observable backgroundColor: string = '#fff'
  @observable border: boolean = true

  @observable currentTabGroup: number = 0
  @observable editingTabGroup: number = -1
  @observable isFullscreen: boolean = false

  @observable extensions: Array<any> = []

  @observable dictionary: any

  url: string = ''
  certificates: Array<any> = []

  pageMenuData = {}
  cursor: { x: number, y: number } = { x: 0, y: 0 }
  app: App
}
