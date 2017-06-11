export default class Component {
  _render (parentElement, props = {}, children = null) {
    this.props = props
    this.props.children = children

    this.elements = {
      parent: parentElement
    }

    if (typeof this.beforeRender === 'function') this.beforeRender(props)

    let tempElements = this.render(props)
    this.renderComponents(tempElements, parentElement)

    if (typeof this.afterRender === 'function') this.afterRender(props)
  }

  renderComponents (elements, parentElement, caller) {
    if (typeof elements === 'object') {
      let elementName = elements.elementName
      let props = elements.attributes
      let children = elements.children

      if (typeof elementName === 'function') {
        let component = new elementName()
        component._render(parentElement, props, children)

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
        parentElement.appendChild(element)

        if (props != null && props.ref != null) {
          if (typeof props.ref === 'function') {
            props.ref(element)
          } else if (typeof props.ref === 'string') {
            this.elements[props.ref] = element
          }
        }

        if (children != null) {
          let childrenToMove = []
          let childrenIndex = 0

          let x = children.length
          while (x--) {
            if (typeof children[x] !== 'string' && children[x].length > 0) {
              childrenToMove = children[x]
              childrenIndex = x
              children.splice(x, 1)
            }
          }

          for (var x = 0; x < childrenToMove.length; x++) {
            children.splice(childrenIndex, 0, childrenToMove[x])
          }

          for (var i = 0; i < children.length; i++) {
            this.renderComponents(children[i], element)
          }
        }
      }
      
    } else if (typeof elements === 'string') {
      parentElement.innerHTML += elements
      return
    }
  }
}