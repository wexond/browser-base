import React from 'react'

import HistoryParser from '../../utils/history'

import ToolBar from '../HistoryToolBar'
import HistoryCards from '../HistoryCards'
import HistorySection from '../HistorySection'

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
    let data = await window.historyAPI.get()

    if (searchStr) {
      data = await window.historyAPI.search(data, searchStr)
    }

    Store.cards = HistoryParser.getCards(data)
    Store.sections = HistoryParser.getSections(data)
  }

  onSearch = (str) => {
    this.loadData(str)
  }

  render () {
    this.sections = []

    return (
      <div className='history'>
        <ToolBar onSearch={this.onSearch} />
        <div className='content'>
          <div className='history-title'>Most visited websites</div>
          <HistoryCards />
          <div className='history-title'>History</div>
          {
            Store.sections.map((data, key) => {
              if (data.items.length > 0) {
                return <HistorySection ref={(r) => { this.sections.push(r) }} data={data} key={key} />
              }
            })
          }
        </div>
      </div>
    )
  }
}