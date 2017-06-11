export default class Component {
  _render (rootElement, props = {}, children = null) {
    this.props = props
    this.props.children = children

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
    if (typeof elements === 'object') {
      let elementName = elements.elementName
      let props = elements.attributes
      let children = elements.children

      if (typeof elementName === 'function') {
        let component = new elementName()
        component._render(rootElement, props, children)

        if (props != null && props.ref != null) {
          if (typeof props.ref === 'function') {
            props.ref(component)
          } else if (typeof props.ref === 'string') {
            this.elements[props.ref] = component
          }
        }
      } else {
        let element = document.createElement(elementName)
        Object.assign(element, props)
        rootElement.appendChild(element)

        if (props != null && props.ref != null) {
          if (typeof props.ref === 'function') {
            props.ref(element)
          } else if (typeof props.ref === 'string') {
            this.elements[props.ref] = element
          }
        }

        if (children != null) {
          let length = children.length
          for (var i = 0; i < length; i++) {
            if (children[i].length > 0) {
              for (var x = 0; x < children[i].length; x++) {
                let child = children[i][x]
                let indexChild = children.indexOf(children[i])
                children.splice(indexChild, 1)
                children.splice(indexChild, 0, child)
              }
            }
          }

          for (var i = 0; i < children.length; i++) {
            this._createElements(children[i], element)
          }
        }
      }
      
    } else if (typeof elements === 'string') {
      rootElement.innerHTML += elements
      return
    }

    
  }
}