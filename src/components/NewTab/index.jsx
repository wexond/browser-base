import React from 'react'

import HistoryParser from '../../utils/history'
import HistoryCards from '../HistoryCards'

import Store from '../../history-store'
import { observer } from 'mobx-react'

export default class NewTab extends React.Component {
  constructor () {
    super()

    this.state = {
      cards: []
    }
  }

  componentDidMount () {
    this.loadData()
  }

  async loadData () {
    const history = await window.historyAPI.get()

    Store.cards = HistoryParser.getCards(history, 9, true)
  }

  render () {
    return (
      <div className='new-tab'>
        <HistoryCards cardsImage={true} cardsDescription={true} cardWidth={220} />
      </div>
    )
  }
}