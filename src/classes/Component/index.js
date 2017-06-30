import UI from '../UI'

export default class Component {
  callRender (parentElement) {
    this.elements = {
      parent: parentElement
    }

    if (typeof this.beforeRender === 'function') this.beforeRender()

    if (this.props != null) {
      for (var key in this.defaultProps) {
        if (this.props[key] == null) {
          this.props[key] = this.defaultProps[key]
        }
      }
    }

    let tempElements = this.render()

    UI.render(tempElements, parentElement, this)

    if (typeof this.afterRender === 'function') this.afterRender()
  }
}
