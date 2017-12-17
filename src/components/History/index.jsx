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
  }

  componentDidMount () {
    Store.history = this

    this.loadData()
  }

  async loadData () {
    const history = await window.historyAPI.get()

    Store.cards = HistoryParser.getCards(history)
    Store.sections = HistoryParser.getSections(history)
  }

  render () {
    return (
      <div className='history'>
        <ToolBar />
        <div className='content'>
          <HistoryCards />
          {
            Store.sections.map((data, key) => {
              if (data.items.length > 0) {
                return <HistorySection data={data} key={key} />
              }
            })
          }
        </div>
      </div>
    )
  }
}