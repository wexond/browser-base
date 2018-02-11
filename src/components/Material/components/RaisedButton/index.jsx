import React from 'react'

import Ripple from '../Ripple'

import { getForeground } from '../../utils/foreground'
import ClassManager from '../../utils/class'

export default class RaisedButton extends React.Component {
  render () {
    const {
      background,
      foreground,
      ripple,
      className,
      children,
      disabled,
      darkTheme,
      onClick,
      onMouseEnter,
      onMouseLeave
    } = this.props

    const foregroundColor = getForeground(foreground)

    const style = {
      backgroundColor: background,
      color: foregroundColor
    }

    const events = {
      onClick: onClick,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave
    }

    const rootClass = ClassManager.get('material-button raised', [
      className,
      foregroundColor,
      disabled ? 'disabled' : '',
      darkTheme ? 'dark-theme' : ''
    ])

    return (
      <div className={rootClass} style={style} {...events}>
        {children}
        <div className='over-shade' />
        <Ripple autoClass={false} autoRipple={!disabled} color={foregroundColor} options={ripple} time={0.6} />
      </div>
    )
  }
}

RaisedButton.defaultProps = {
  background: '#E0E0E0',
  foreground: false,
  disabled: false,
  darkTheme: false
}