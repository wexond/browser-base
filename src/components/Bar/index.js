import Component from '../../classes/Component'

export default class Bar extends Component {
  beforeRender () {

  }

  render () {
    return (
      <div className='bar' ref='bar'>
        <div className='bar-icon bar-icon-back' />
        <div className='bar-icon bar-icon-forward' />
        <div className='bar-icon bar-icon-refresh' />

        <div className='bar-icon-info' />

        <div className='bar-icon bar-icon-menu' />
      </div>
    )
  }

  afterRender () {

  }
}