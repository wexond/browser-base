export default class UI {
  static fixRefsForChildren (children, caller) {
    if (children != null) {
      for (var i = 0; i < children.length; i++) {
        if (typeof children[i] === 'object') {
          children[i].baseComponent = caller
          UI.fixRefsForChildren(children[i].children, caller)
        }
      }
    }
  }

  static render (elements, parentElement, caller = null) {
    if (elements == null) return
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

        UI.fixRefsForChildren(children, caller)

        element.callRender(parentElement, props, children)
      } else {
        element = document.createElement(elementName)
        Object.assign(element, props)
        parentElement.appendChild(element)

        if (props != null) {
          if (typeof props.onClick === 'function') element.addEventListener('click', props.onClick)
          if (typeof props.onMouseDown === 'function') element.addEventListener('mousedown', props.onMouseDown)
          if (typeof props.onMouseUp === 'function') element.addEventListener('mouseup', props.onMouseUp)
          if (typeof props.onMouseEnter === 'function') element.addEventListener('mouseenter', props.onMouseEnter)
          if (typeof props.onMouseLeave === 'function') element.addEventListener('mouseleave', props.onMouseLeave)
          if (typeof props.onTouchStart === 'function') element.addEventListener('touchstart', props.onTouchStart)
          if (typeof props.onFocus === 'function') element.addEventListener('focus', props.onFocus)
          if (typeof props.onBlur === 'function') element.addEventListener('blur', props.onBlur)
          if (typeof props.onInput === 'function') element.addEventListener('input', props.onInput)
          if (typeof props.onChange === 'function') element.addEventListener('change', props.onChange)
          if (typeof props.onKeyPress === 'function') element.addEventListener('keypress', props.onKeyPress)
          if (typeof props.onKeyDown === 'function') element.addEventListener('keydown', props.onKeyDown)

          if (typeof props.style === 'object') {
            Object.assign(element.style, props.style)
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
          if (elements.baseComponent != null) {
            elements.baseComponent.elements[props.ref] = element
          } else {
            caller.elements[props.ref] = element
          }
          
        }
      }
    } else if (typeof elements === 'string') {
      parentElement.innerHTML += elements
    }
  }
}