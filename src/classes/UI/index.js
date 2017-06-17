export default class UI {
  static setRefsForChildren (children, context) {
    if (children != null) {
      for (var i = 0; i < children.length; i++) {
        let props = children[i].attributes
        if (props != null && props.ref != null) {
          if (typeof props.ref === 'function') {
            props.ref(element)
          } else if (typeof props.ref === 'string') {
            context.elements[props.ref] = children[i]
          }
        }
        UI.setRefsForChildren(children[i].children, context)
      }
    }
  }

  static render (elements, parentElement, caller = null) {
    if (typeof elements === 'object') {
      let elementName = elements.elementName
      let props = elements.attributes
      let children = elements.children

      let element

      if (typeof elementName === 'function') {
        element = new elementName()

        element.props = props
        if (children == null) children = []
        element.props.children = children

        element.callRender(parentElement, props, children)

        UI.setRefsForChildren(children, caller)
      } else {
        element = document.createElement(elementName)
        Object.assign(element, props)
        parentElement.appendChild(element)

        if (props != null) {
          if (typeof props.onClick === 'function') element.addEventListener('click', props.onClick)
          if (typeof props.onMouseDown === 'function') element.addEventListener('mousedown', props.onMouseDown)
          if (typeof props.onTouchStart === 'function') element.addEventListener('touchstart', props.onTouchStart)
          if (typeof props.onFocus === 'function') element.addEventListener('focus', props.onFocus)
          if (typeof props.onBlur === 'function') element.addEventListener('blur', props.onBlur)
          if (typeof props.onInput === 'function') element.addEventListener('input', props.onInput)

          if (typeof props.style === 'object') {
            Object.assign(element.style, props.style)
          }

          if (caller != null) {
            for (var key in caller.defaultProps) {
              if (props[key] === null) {
                props[key] = caller.defaultProps[key]
              }
            }
          }
        }

        if (children != null) {
          let childrenToMove = []
          let childrenIndex = 0

          let x = children.length
          while (x--) {
            if (children[x] != null && typeof children[x] !== 'string' && children[x].length > 0) {
              childrenToMove = children[x]
              childrenIndex = x
              children.splice(x, 1)
            }
          }

          for (x = childrenToMove.length - 1; x >= 0; x--) {
            if (typeof childrenToMove[x] !== 'string') {
              childrenToMove[x].isPropChild = true
            }

            children.splice(childrenIndex, 0, childrenToMove[x])
          }

          for (var i = 0; i < children.length; i++) {
            UI.render(children[i], element, caller)
          }
        }
      }

      if (caller != null && props != null && props.ref != null) {
        if (typeof props.ref === 'function') {
          props.ref(element)
        } else if (typeof props.ref === 'string') {
          caller.elements[props.ref] = element
        }
      }
    } else if (typeof elements === 'string') {
      parentElement.innerHTML += elements
    }
  }
}