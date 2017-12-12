import { observable, observe, intercept } from 'mobx'

export default new class Store {
  @observable tabGroups = []
  @observable pages = []
  @observable addTabLeft = 0
  @observable selectedTab = -1
  @observable tabDragData = {}
  @observable foreground = 'black'
  @observable backgroundColor = '#fff'
  @observable currentTabGroup = 0

  url = ''
  certificates = []
  pageMenuData = {}
  cursor = {}
}
