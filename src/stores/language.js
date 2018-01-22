import { observable, observe, intercept } from 'mobx'

export default new class Store {
  @observable dictionary = true
}
