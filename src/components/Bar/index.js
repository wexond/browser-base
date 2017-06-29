import Component from '../../classes/Component'

export default class Bar extends Component {
  beforeRender () {
    this.isAddressbarBarToggled = false
  }

  onAddressBarClick = (e) => {
    e.stopPropagation()
    if (!this.isAddressbarBarToggled) {
      this.toggleInput(true)
    }
  }

  onFocus = (e) => {
    this.elements.input.setSelectionRange(0, this.elements.input.value.length)
  }

  onKeyPress = (e) => {
    if (e.which === 13) {
      app.getSelectedTab().getWebView().loadURL(this.elements.input.value)
    }
  }

  render () {
    return (
      <div className='bar' ref='bar'>
        <div className='bar-icon bar-icon-back' />
        <div className='bar-icon bar-icon-forward' />
        <div className='bar-icon bar-icon-refresh' />
        <div className='bar-addressbar' onClick={this.onAddressBarClick}>
          <div className='bar-addressbar-icon-info' />
          <div ref='title' className='bar-addressbar-title' />
          <div className='bar-addressbar-divider' />
          <div ref='shortUrl' className='bar-addressbar-shorturl' />
          <input ref='input' onFocus={this.onFocus} onKeyPress={this.onKeyPress} className='bar-input' />
        </div>

        <div className='bar-icon bar-icon-menu' />
      </div>
    )
  }

  afterRender () {
    const self = this

    window.addEventListener('mouseup', function (e) {
      self.elements.input.style.display = 'none'
      self.isAddressbarBarToggled = false
    })
  }

  setTitle (title) {
    this.elements.title.textContent = title
  }

  setDomain (url) {
    let hostname = url

    hostname = hostname.split('://')[1]

    hostname = hostname.split(':')[0]
    hostname = hostname.split('?')[0]
    hostname = hostname.split('/')[0]

    this.elements.shortUrl.textContent = hostname
  }

  toggleInput (flag) {
    const self = this

    this.isAddressbarBarToggled = flag

    this.elements.input.style.display = (flag) ? 'block' : 'none'

    if (flag) {
      this.elements.input.focus()
    }
  }

  setURL (url) {
    this.elements.input.value = url
  }
}