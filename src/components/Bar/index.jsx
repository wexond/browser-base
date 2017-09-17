import Component from 'inferno-component'

import AddressBar from '../AddressBar'

export default class Bar extends Component {
  componentDidMount () {
    this.focus = this.addressBar.focus
    this.setURL = this.addressBar.setURL
    this.setInfo = this.addressBar.setInfo
    this.setInputToggled = this.addressBar.setInputToggled
  }

  render () {
    return (
      <div className='bar'>
        <div className='bar-icon back' />
        <div className='bar-icon forward' />
        <div className='bar-icon refresh' />
        <AddressBar ref={(r) => { this.addressBar = r }} />
        <div className='bar-icon menu' />
      </div>
    )
  }
}