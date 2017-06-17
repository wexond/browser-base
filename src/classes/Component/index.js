import UI from '../UI'

export default class Component {
  callRender (parentElement) {
    this.elements = {
      parent: parentElement
    }

    if (typeof this.beforeRender === 'function') this.beforeRender()

    let tempElements = this.render()
    UI.render(tempElements, parentElement, this)

    if (typeof this.afterRender === 'function') this.afterRender()
  }
}
