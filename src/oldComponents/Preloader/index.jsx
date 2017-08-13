import Component from '../../component'

export default class Preloader extends Component {
  /**
   * Gets root.
   * @return {DOMElement} root.
   */
  getRoot = () => {
    return this.elements.root
  }

  render () {
    return (
      <div className='material-preloader' ref='root' />
    )
  }

  afterRender () {
    const props = this.props
    const root = this.getRoot()

    // Must add svg manually.
    this.elements.svg = document.createElement('svg')
    this.elements.svg.className = 'preloader-indeterminate'
    this.elements.svg.setAttribute('viewBox', '25 25 50 50')

    this.elements.circle = document.createElement('circle')
    this.elements.circle.className = 'path'
    this.elements.circle.setAttributes({
      cx: '50',
      cy: '50',
      r: '20',
      fill: 'none',
      'stroke-miterlimit': '10'
    })

    this.elements.svg.appendChild(this.elements.circle)

    root.innerHTML = this.elements.svg.outerHTML

    if (props.className != null) root.classList.add(props.className)
  }
}
