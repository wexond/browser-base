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
        
        <div className='bar-addressbar'>
          <div className='bar-addressbar-icon-info' />
          <div ref='title' className='bar-addressbar-title' />
          <div className='bar-addressbar-divider' />
          <div ref='shortUrl' className='bar-addressbar-shorturl' />
        </div>

        <div className='bar-icon bar-icon-menu' />
      </div>
    )
  }

  afterRender () {
    this.elements.title.textContent = 'Google'
    this.elements.shortUrl.textContent = 'www.google.com'
  }
}