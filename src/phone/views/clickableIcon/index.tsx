import * as React from 'react'
import { FontAwesomeIcon, Props } from '@fortawesome/react-fontawesome'

interface ClickableIconProps extends Props {
  onClick: (...args: any[]) => void
}

export class ClickableIcon extends React.Component<ClickableIconProps> {
  render() {
    return (
      <span className={this.props.className} onClick={this.props.onClick}>
        <FontAwesomeIcon {...this.props}  />
      </span>
    )
  }
}
