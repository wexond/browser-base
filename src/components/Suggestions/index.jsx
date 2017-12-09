import Component from 'inferno-component'

import { observer } from 'inferno-mobx'
import Store from '../../store'

import Suggestion from '../Suggestion'

import { getHistorySuggestions, getSearchSuggestions } from '../../actions/suggestions'

@observer
export default class Suggestions extends Component {
  constructor () {
    super()

    this.state = {
      visible: false,
      suggestions: []
    }

    this.lastSearchSuggestions = []
  }

  hide () {
    this.setState({visible: false})
  }

  show () {
    this.setState({visible: true})
  }

  suggest = async (text) => {
    const historySuggestions = await getHistorySuggestions(text)

    this.setState({suggestions: historySuggestions.concat(this.lastSearchSuggestions)})

    getSearchSuggestions(text).then((data) => {
      const suggestions = historySuggestions.concat(data)
      this.setState({suggestions: suggestions})

      this.lastSearchSuggestions = data

      if (this.state.suggestions.length === 0) this.hide()
      else this.show()
    })
  }

  whatToSuggest = () => {
    if (this.state.suggestions[0] != null && this.state.suggestions[0].title != null) {
      return this.state.suggestions[0].url
    }
    return null
  }

  render () {
    const {
      visible,
      suggestions
    } = this.state

    const suggestionsStyle = {
      display: (visible) ? 'flex' : 'none'
    }

    return (
      <div style={suggestionsStyle} className='suggestions'>
        {suggestions.map((item, key) => {
          return <Suggestion key={key} title={item.title} url={item.url} />
        })}
      </div>
    )
  }
}
