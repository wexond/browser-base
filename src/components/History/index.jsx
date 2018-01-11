import React from 'react'

import HistoryParser from '../../utils/history'

import ToolBar from '../HistoryToolBar'
import HistoryCards from '../HistoryCards'
import HistorySection from '../HistorySection'

import Preloader from '../Preloader'

import Store from '../../history-store'
import { observer } from 'mobx-react'

@observer
export default class History extends React.Component {
  constructor () {
    super()

    this.sections = []
  }

  componentDidMount () {
    Store.history = this

    this.loadData()
  }

  async loadData (searchStr) {
    Store.loading = true

    let data = await window.historyAPI.get()

    if (searchStr) {
      data = await window.historyAPI.search(data, searchStr)
    }

    Store.cards = HistoryParser.getCards(data)
    Store.sections = HistoryParser.getSections(data)

    Store.loading = false
  }

  onSearch = (str) => {
    this.loadData(str)
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

    return (
      <div className='history'>
        <ToolBar onSearch={this.onSearch} />
        <div className={containerClassName} style={contentStyle}>
          {!emptyHistory &&
            <div>
              <div className='history-title'>Most visited websites</div>
              <HistoryCards />
              <div className='history-title'>History</div>
              {
                Store.sections.map((data, key) => {
                  return <HistorySection ref={(r) => { this.sections.push(r) }} data={data} key={key} />
                })
              }
            </div> || !Store.loading &&
            <div className='history-no-results'>No search results</div>
          }
        </div>
        <Preloader style={preloaderStyle} />
      </div>
    )
  }
}