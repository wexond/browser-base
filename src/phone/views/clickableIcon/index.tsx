import * as React from 'react'
import { FontAwesomeIcon, Props } from '@fortawesome/react-fontawesome'

interface ClickableIconProps extends Props {
  onClick: (...args: any[]) => void
}

export class ClickableIcon extends React.Component<ClickableIconProps> {
  render() {
    return (
        <FontAwesomeIcon { ...this.props }  />
    )
  }
}
