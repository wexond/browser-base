import * as React from 'react'
import './PhoneNumber.css'

interface PhoneNumberProps {
  number?: string
}

export class PhoneNumber extends React.Component<PhoneNumberProps> {
  render() {
    return (
      <div className="phoneNumber">{this.props.number}</div>
    )
  }
}
