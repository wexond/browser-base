import React from 'react'

import Ripple from '../Ripple'

import ClassManager from '../../utils/class'

export default class FlatButton extends React.Component {
  render () {
    const {
      color,
      ripple,
      className,
      children,
      disabled,
      darkTheme,
      onClick,
      onMouseEnter,
      onMouseLeave
    } = this.props

    const style = {
      color: color
    }

    const events = {
      onClick: onClick,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave
    }

    const rootClass = ClassManager.get('material-button flat', [
      className,
      disabled ? 'disabled' : '',
      darkTheme ? 'dark-theme' : ''
    ])

    return (
      <div className={rootClass} style={Object.assign(style, this.props.style)} {...events}>
        {children}
        <div className='over-shade' style={{backgroundColor: color}}/>
        <Ripple autoClass={false} autoRipple={!disabled} color={color} options={ripple} time={0.6} />
      </div>
    )
  }
}

FlatButton.defaultProps = {
  color: '#3F51B5',
  disabled: false,
  darkTheme: false,
  style: {}
}