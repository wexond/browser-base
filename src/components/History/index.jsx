import React from 'react'

import HistoryParser from '../../utils/history'

import ToolBar from '../HistoryToolBar'
import HistoryCards from '../HistoryCards'
import Section from '../HistorySection'

export default class History extends React.Component {
  constructor () {
    super()

    this.state = {
      cards: [],
      sections: []
    }

    this.selectedUrls = []
  }

  componentDidMount () {
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
        <ToolBar />
        <div className='content'>
          <HistoryCards items={this.state.cards} />
          {
            this.state.sections.map((data, key) => {
              return <Section data={data} key={key} getHistory={() => { return this }} />
            })
          }
        </div>
      </div>
    )
  }
}