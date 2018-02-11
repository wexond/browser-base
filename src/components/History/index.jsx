import React from 'react'

import HistoryParser from '../../utils/history'

import ToolBar from './ToolBar'
import Cards from './Cards'
import Section from './Section'

import Preloader from '../Material/Preloader'

import Store from '../../stores/history'
import { observer } from 'mobx-react'

@observer
export default class History extends React.Component {
  constructor() {
    super()

    this.sections = []
    window.dictionary = window.dictionaryAPI.get()

    document.title = window.dictionary.pages.history.title
  }

  componentDidMount() {
    Store.history = this

    this.loadData()
  }

  async loadData(searchStr = false) {
    Store.loading = true

    let data = await window.historyAPI.get()

    if (searchStr) data = await window.historyAPI.search(data, searchStr)
    else Store.searched = false

    Store.cards = HistoryParser.getCards(data)
    Store.sections = HistoryParser.getSections(data)
    Store.loading = false
  }

  getSelectedCheckBoxes(sectionIndex) {
    const filter = (item) => {
      return item.props.sectionIndex === sectionIndex
    }

    return Store.selectedItems.filter(filter)
  }

  onSearch = (str) => {
    Store.searched = true
    this.loadData(str)
  }

  onCancel = () => {
    for (var i = 0; i < Store.selectedItems.length; i++) {
      const checkbox = Store.selectedItems[i]
      checkbox.setState({ checked: false })
    }

    for (var i = 0; i < this.sections.length; i++) {
      const checkbox = this.sections[i].checkbox

      if (checkbox.state.checked) {
        checkbox.setState({
          checked: false
        })
      }
    }

    Store.selectedItems = []
  }

  onDelete = async () => {
    const deletedItems = []
    const selectedItems = Store.selectedItems.slice()

    for (var i = selectedItems.length; i--;) {
      const selectedItem = Object.assign({}, selectedItems[i])

      deletedItems.push(selectedItem.props.data)

      for (var y = Store.sections.length; y--;) {
        const section = Store.sections[y]

        for (var z = section.items.length; z--;) {
          const item = section.items[z]

          if (item.id === selectedItem.props.data.id) {  
            section.items.splice(section.items.indexOf(item), 1)
          }
        }
      }
    }

    this.onCancel()

    await window.historyAPI.delete(deletedItems)
  }

  render() {
    this.sections = []

    const isHistoryEmpty = Store.sections.length === 0

    const contentStyle = {
      opacity: !Store.loading ? 1 : 0
    }

    const preloaderStyle = {
      display: !Store.loading ? 'none' : 'block'
    }

    const containerClassName = 'content ' + (Store.selectedItems.length > 0 ? 'selecting' : '')

    let sectionIndex = -1

    const {
      title,
      cardsHeader,
      historyHeader,
      emptyHistory
    } = window.dictionary.pages.history

    const {
      noMatches
    } = window.dictionary.searching

    return (
      <div className='history'>
        <ToolBar
          title={title}
          selectedItems={Store.selectedItems}
          onSearch={this.onSearch}
          onCancel={this.onCancel}
          onDelete={this.onDelete} />
        <div className={containerClassName} style={contentStyle}>
          {!isHistoryEmpty &&
            <div>
              <div className='history-title'>{cardsHeader}</div>
              <Cards />
              <div className='history-title'>{historyHeader}</div>
              {
                Store.sections.map((data, key) => {
                  sectionIndex++
                  return <Section ref={(r) => { if (r != null) this.sections.push(r) }} data={data} key={key} index={sectionIndex} />
                })
              }
            </div> || !Store.loading &&
            <div className='history-no-results'>
              {Store.searched ? noMatches : emptyHistory}
            </div>
          }
        </div>
        <Preloader style={preloaderStyle} />
      </div>
    )
  }
}