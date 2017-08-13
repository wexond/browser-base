import { observable, observe, intercept } from 'mobx'

export default new class Store {
  @observable tabs = []
  @observable addTabLeft = 0
  @observable selectedTab = -1

  async init () {
    const disposer = observe(this.tabs, change => {
      
    })
  }
}