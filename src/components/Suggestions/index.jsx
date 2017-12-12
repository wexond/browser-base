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
      suggestions: [],
      selectedSuggestion: 0
    }

    this.lastSearchSuggestions = []
    this.hidden = false
  }

  hide = () => {
    this.setState({visible: false})
  }

  show () {
    this.setState({visible: true})
  }

  suggest = async (text) => {
    const historySuggestions = await getHistorySuggestions(text)

    this.setState({suggestions: historySuggestions.concat(this.lastSearchSuggestions)})

    const toggle = () => {
      if (this.hidden) return this.hidden = false
      
      if (this.state.suggestions.length === 0) {
        this.hide()
      }
      else {
        this.show()
      }
    }

    getSearchSuggestions(text).then((data) => {
      const suggestions = historySuggestions.concat(data)
      this.setState({suggestions: suggestions})

      this.lastSearchSuggestions = data

      toggle()
    })

    toggle()
  }

  getSelectedSuggestion () {
    return this.state.suggestions[this.state.selectedSuggestion]
  }

  selectNext () {
    let selectedSuggestion = this.state.selectedSuggestion
    if (!(selectedSuggestion + 1 > this.state.suggestions.length - 1)) selectedSuggestion++
    this.setState({selectedSuggestion: selectedSuggestion})
  }

  selectPrevious () {
    let selectedSuggestion = this.state.selectedSuggestion
    if (!(selectedSuggestion - 1 < 0)) selectedSuggestion--
    this.setState({selectedSuggestion: selectedSuggestion})
  }

  selectByIndex (index) {
    this.setState({selectedSuggestion: index})
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

    const onMouseDown = (e) => {
      e.stopPropagation()
    }

    return (
      <div onMouseDown={onMouseDown} style={suggestionsStyle} className='suggestions'>
        {suggestions.map((item, key) => {
          let selected = false
          if (this.state.selectedSuggestion === key) selected = true
          return <Suggestion key={key} title={item.title} url={item.url} selected={selected} hide={this.hide} />
        })}
      </div>
    )
  }
}
