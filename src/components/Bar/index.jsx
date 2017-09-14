import Component from 'inferno-component'

import AddressBar from '../AddressBar'

export default class Bar extends Component {
  render () {
    return (
      <div className='bar'>
        <div className='bar-icon back' />
        <div className='bar-icon forward' />
        <div className='bar-icon refresh' />
        <AddressBar />
        <div className='bar-icon menu' />
      </div>
    )
  }
}