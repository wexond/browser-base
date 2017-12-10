import { observable, observe, intercept } from 'mobx'

export default new class Store {
  @observable tabs = []
  @observable pages = []
  @observable addTabLeft = 0
  @observable selectedTab = -1
  @observable tabDragData = {}
  @observable foreground = 'black'
  @observable backgroundColor = '#fff'

  url = ''
  certificates = []
  pageMenuData = {}
  cursor = {}
}
