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
              return <Section data={data} key={key} />
            })
          }
        </div>
      </div>
    )
  }
}

/*
      cards: [
        {
          url: 'https://www.github.com',
          title: 'GitHub',
          description: 'Build for developers',
          image: 'https://scontent-waw1-1.xx.fbcdn.net/v/t1.0-9/24899862_2050574158507064_8530629417294747664_n.jpg?oh=eba9b82613dacc8a41e99d63ca32c845&oe=5ACD27C8',
          favicon: 'https://image.flaticon.com/icons/svg/25/25231.svg',
        },
        */