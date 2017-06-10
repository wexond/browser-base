export default class Component {
  _render (rootElement, props = null) {
    if (typeof this.beforeRender === 'function') this.beforeRender(props)
    let tempElements = this.render(props)
    this.elements = {
      root: rootElement
    }
    this._createElements(tempElements, rootElement)
    if (typeof this.afterRender === 'function') this.afterRender(props)
  }

  renderComponent (elements, rootElement) {
    let tempElements = elements
    this._createElements(elements, rootElement)
  }

  _createElement (tag, props, ref, parent) {
    let el = document.createElement(tag)
    Object.assign(el, props)
    parent.appendChild(el)
    
    if (ref != null) {
      this.elements[ref] = el
    }

    return el
  }

  _createComponent (component, parent, props, ref) {
    component._render(parent, props)
    if (ref != null) {
      this.elements[ref] = component
    }
  }

  _createElements (element, domElement) {
    if (element != null && element.children != null) {
      for (var i = 0; i < element.children.length; i++) {
        if (element.children[i].tag != null) {
          let el = this._createElement(element.children[i].tag, element.children[i].props, element.children[i].ref, domElement)
          this._createElements(element.children[i], el)
        }
        if (element.children[i].component != null) {
          this._createComponent(element.children[i].component, domElement, element.children[i].props, element.children[i].ref)
        }
      }
    }
  }
}