class Page {
  constructor (url, title, icon) {
    this.elements = {}

    // Create root.
    this.elements.root = document.createElement('a')
    this.elements.root.href = url
    this.elements.root.className = 'page'

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