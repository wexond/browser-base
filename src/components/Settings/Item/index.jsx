import React from 'react'

import Ripple from '../../Ripple'
import Switch from '../../Switch'
import Dropdown from '../../Dropdown'
import RadioButtonsContainer from '../../RadioButtonsContainer'

export default class Item extends React.Component {
  constructor () {
    super()

    this.childrenContainerToggled = false
  }

  onSwitchToggle = (e) => {
    const type = this.props.type
    
    if (type === 'radiobuttons') {
      this.toggleChildrenContainer(!this.childrenContainerToggled)
    }
  }

  toggleChildrenContainer (flag) {
    if (this.childrenContainer != null) {
      const height = flag ? this.childrenContainer.scrollHeight : 0

      this.childrenContainer.style.height = height + 'px'
      this.childrenContainerToggled = flag
    }
  }

  render() {
    const {
      title,
      description,
      type,
      items
    } = this.props

    const childrenContainer = type === 'radiobuttons'

    return (
      <div className='section-item'>
        <div className='center-items'>
          <div className='info-container'>
            <div className='title'>
              {title}
            </div>
            <div className='description'>
              {description}
            </div>
          </div>
          <div className='action-container'>
            {type === 'button' && (
              <div className='button-icon icon'>
                <Ripple center={true} />
              </div>
            ) ||
              type === 'switch' || type === 'radiobuttons' && (
                <Switch onToggle={this.onSwitchToggle} />
              ) ||
              type === 'dropdown' && (
                <Dropdown items={items} />
              )
            }
          </div>
        </div>
        {childrenContainer &&
          (
            <div className='children-container' ref={(r) => this.childrenContainer = r}>
              Foo
            </div>
          )
        }
      </div>
    )
  }
}

Item.defaultProps = {
  type: 'button'
}