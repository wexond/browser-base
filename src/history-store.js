import { observable, observe, intercept } from 'mobx'

export default new class Store {
  @observable selectedItems = []
  @observable sections = []
  @observable cards = []
  @observable loading = true

  history = null
}
