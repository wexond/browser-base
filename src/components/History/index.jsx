import React from 'react'

import HistoryParser from '../../utils/history'

import ToolBar from '../ToolBar'
import HistoryCards from '../HistoryCards'
import HistorySection from '../HistorySection'

import Preloader from '../Preloader'

import Store from '../../stores/history'
import { observer } from 'mobx-react'

import LanguageHelper from '../../utils/language'

@observer
export default class History extends React.Component {
  constructor () {
    super()

    this.sections = []
    window.dictionary = window.dictionaryAPI.get()

    document.title = LanguageHelper.capFirst(window.dictionary.pages.history.title)
  }

  componentDidMount () {
    Store.history = this

    this.loadData()
  }

  async loadData (searchStr = false) {
    Store.loading = true

    let data = await window.historyAPI.get()

    if (searchStr) data = await window.historyAPI.search(data, searchStr)
    else Store.searched = false

    Store.cards = HistoryParser.getCards(data)
    Store.sections = HistoryParser.getSections(data)
    Store.loading = false
  }

  getSelectedCheckBoxes (sectionIndex) {
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
      checkbox.setState({checked: false})
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
    Store.loading = true

    const selectedItems = Store.selectedItems.slice()
    const deletedItems = []

    this.onCancel()

    for (var i = 0; i < selectedItems.length; i++) {
      deletedItems.push(selectedItems[i].props.data)
    }

    await window.historyAPI.delete(deletedItems)
    await this.loadData()
  }

  render () {
    this.sections = []

    const emptyHistory = Store.sections.length === 0

    const contentStyle = {
      opacity: !Store.loading ? 1 : 0
    }

    const preloaderStyle = {
      display: !Store.loading ? 'none' : 'block'
    }

    const containerClassName = 'content ' + (Store.selectedItems.length > 0 ? 'selecting' : '')

    let sectionIndex = -1

    return (
      <div className='history'>
        <ToolBar
          title={LanguageHelper.capFirst(window.dictionary.pages.history.title)}
          selectedItems={Store.selectedItems}
          onSearch={this.onSearch}
          onCancel={this.onCancel}
          onDelete={this.onDelete} />
        <div className={containerClassName} style={contentStyle}>
          {!emptyHistory &&
            <div>
              <div className='history-title'>{LanguageHelper.capFirst(window.dictionary.pages.history.cardsHeader)}</div>
              <HistoryCards />
              <div className='history-title'>{LanguageHelper.capFirst(window.dictionary.pages.history.historyHeader)}</div>
              {
                Store.sections.map((data, key) => {
                  sectionIndex++
                  return <HistorySection ref={(r) => { if (r != null) this.sections.push(r) }} data={data} key={key} index={sectionIndex} />
                })
              }
            </div> || !Store.loading &&
            <div className='history-no-results'>
              {Store.searched ? 'No search results' : 'History is empty'}
            </div>
          }
        </div>
        <Preloader style={preloaderStyle} />
      </div>
    )
  }
}