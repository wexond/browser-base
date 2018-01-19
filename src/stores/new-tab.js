import { observable, observe, intercept } from 'mobx'

export default new class Store {
  @observable loading = true
  @observable news = []

  newTab = null
}
