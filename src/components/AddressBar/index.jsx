import Component from 'inferno-component'

export default class AddressBar extends Component {
  render () {
    return (
      <div className='address-bar'>
        <input placeholder='Search' />
      </div>
    )
  }
}