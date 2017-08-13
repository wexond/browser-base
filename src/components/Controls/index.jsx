import Component from 'inferno-component'

export default class Controls extends Component {
  render () {
    return (
      <div className='controls'>
        <div className='close'>
          <div className='icon' />
        </div>
        <div className='maximize'>
          <div className='icon' />
        </div>
        <div className='minimize'>
          <div className='icon' />
        </div>
      </div>
    )
  }
}