class Page {
  constructor (url, title, icon) {
    const self = this

    this.rippleStyle = {
      backgroundColor: '#fff',
      opacity: 0.15
    }

    this.elements = {}

    // Create root.
    this.elements.root = document.createElement('a')
    this.elements.root.href = url
    this.elements.root.className = 'page ripple'

    this.elements.root.addEventListener('mousedown', function (e) {
      const ripple = Ripple.createRipple(self.elements.root, self.rippleStyle, createRippleMouse(self.elements.root, e, 1.5))
      Ripple.makeRipple(ripple)
    })

    // Create icon and append it to root.
    this.elements.icon = document.createElement('div')
    this.elements.icon.className = 'icon'
    this.elements.icon.style.backgroundImage = 'url(' + icon + ')'
    this.elements.root.appendChild(this.elements.icon)

    // Create title and append it to root.
    this.elements.title = document.createElement('span')
    this.elements.title.className = 'title'
    this.elements.title.innerHTML = title
    this.elements.root.appendChild(this.elements.title)

    return this.elements.root
  }
}