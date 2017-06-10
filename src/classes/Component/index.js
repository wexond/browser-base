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
    this._createElements(elements, rootElement)
  }

  _createElements(elements, rootElement) {
    let element
    if (typeof elements === 'object') {
      element = this._createElement(elements.elementName, elements.attributes, rootElement)
    } else if (typeof elements === 'string') {
      rootElement.innerHTML += elements
      return
    }

    if (elements.children != null) {
      for (var i = 0; i < elements.children.length; i++) {
        if (element.isDOM) {
          this._createElements(elements.children[i], element.element)
        }
      }
    }
  }

  _createElement (elementName, props, rootElement) {
    if (typeof elementName === 'function') {
      let component = new elementName()
      component._render(rootElement, props)

      if (props.ref != null) {
        if (typeof props.ref === 'function') {
          props.ref(component)
        } else if (typeof props.ref === 'string') {
          this.elements[props.ref] = component
        }
      }

      return {element: component, isDOM: false}
    } else {
      let element = document.createElement(elementName)
      Object.assign(element, props)
      rootElement.appendChild(element)

      if (props.ref != null) {
        if (typeof props.ref === 'function') {
          props.ref(element)
        } else if (typeof props.ref === 'string') {
          this.elements[props.ref] = element
        }
      }
      return {element: element, isDOM: true}
    }
  }
}