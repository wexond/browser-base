import React from 'react'

import HistoryParser from '../../utils/history'

import ToolBar from '../HistoryToolBar'
import HistoryCards from '../HistoryCards'
import HistorySection from '../HistorySection'

import Store from '../../history-store'

export default class History extends React.Component {
  constructor () {
    super()

    this.state = {
      cards: [],
      sections: [],
      selectedUrls: [],
      selectingMode: false
    }

    this.selectedCheckboxes = []
  }

  componentDidMount () {
    Store.history = this
    this.loadData()
  }

  async loadData () {
    const history = await window.historyAPI.get()

    this.setState({
      cards: HistoryParser.getCards(history),
      sections: HistoryParser.getSections(history)
    })
  }

  render () {
    return (
      <div className='history'>
        <ToolBar selectingMode={this.state.selectingMode} selectedUrls={this.state.selectedUrls} onExitIconClick={this.onToolbarExitIconClick} />
        <div className='content'>
          <HistoryCards items={this.state.cards} />
          {
            this.state.sections.map((data, key) => {
              if (data.items.length > 0) {
                return <HistorySection data={data} key={key} onItemSelect={this.onItemSelect} />
              }
            })
          }
        </div>
      </div>
    )
  }
}