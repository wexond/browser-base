import { observable, observe, intercept } from 'mobx'

export default new class Store {
  @observable loading: boolean = true
  @observable news: any[] = []

  newTab: any = null
}
