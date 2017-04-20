import React from 'react'

export default class Suggestion extends React.Component {
  constructor () {
    super()

    this.state = {
      text: '',
      url: '',
      title: '',
      selected: false,
      hovered: false
    }
  }

  componentDidMount () {
    var bar = this.props.getBar()
    var data = this.props.data
    this.setState({url: data.url, title: data.title})

    bar.suggestions.push(this)

    bar.selectSuggestionByIndex(0)
  }

  componentWillUnmount () {
    var suggestions = this.props.getBar().suggestions
    suggestions.splice(suggestions.indexOf(this), 1)
  }

  render () {
    const self = this
    var suggestionClass = (this.state.selected) ? 'suggestion suggestion-selected' : 'suggestion'
    suggestionClass += (this.state.hovered) ? ' suggestion-hovered' : ''

    var content
    var style = {}

    if (this.props.data.type === 'history') {
      content = (
        <div>
          <div className='suggestion-url'>{this.state.url}</div>
          <div className='suggestion-title'>{' — ' + this.state.title}</div>
        </div>
      )
    }
    if (this.props.data.type === 'search') {
      content = this.state.title
    }
    if (this.props.data.type === 'info') {
      content = (
        <div>
          {this.props.data.url + ' — ' + this.props.data.hint}
        </div>
      )
      style = {marginTop: 16}
    }

    /** Events */

    function onMouseEnter () {
      if (!self.state.selected) {
        self.setState({hovered: true})
      }
    }

    function onMouseLeave () {
      if (!self.state.selected) {
        self.setState({hovered: false})
      }
    }

    return (
        <div style={style} onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter} className={suggestionClass}>
          {content}
          <div className='clear-both' />
        </div>
    )
  }
}
