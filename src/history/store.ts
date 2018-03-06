import { observable, observe, intercept } from 'mobx'

export default new class Store {
  @observable selectedItems: any[] = []
  @observable sections: any[] = []
  @observable cards: any[] = []
  @observable loading: boolean = true
  @observable searched: boolean = false

  history: any = null
}
