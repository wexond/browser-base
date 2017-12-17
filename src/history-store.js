import { observable, observe, intercept } from 'mobx'

export default new class Store {
  @observable selectedItems = []

  history = null
}
