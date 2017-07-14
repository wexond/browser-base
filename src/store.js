export default new class Store {
  constructor () {
    // Public properties.
    this.tabs = []
    this.certificates = []
    this.pageMenuData = {}
    this.hoveredTab = {}
    this.cursor = {}
    this.app = {}
  }
}
