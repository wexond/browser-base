import Component from 'inferno-component'

export default class Bar extends Component {
  render () {
    return (
      <div className='bar'>
        <div className='bar-icon back' />
        <div className='bar-icon forward' />
        <div className='bar-icon refresh' />
        <div className='address-bar' />
        <div className='bar-icon menu' />
      </div>
    )
  }
}