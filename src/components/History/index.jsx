import React from 'react'

import ToolBar from '../HistoryToolBar'
import Cards from '../HistoryCards'
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
    this.loadCards()
    this.loadSections()
  }

  // TODO: Load from JSON file
  loadCards () {
    this.setState({
      cards: [
        {
          url: 'https://www.github.com',
          title: 'GitHub',
          description: 'Build for developers',
          screenshot: 'https://scontent-waw1-1.xx.fbcdn.net/v/t1.0-9/24899862_2050574158507064_8530629417294747664_n.jpg?oh=eba9b82613dacc8a41e99d63ca32c845&oe=5ACD27C8',
          icon: 'https://image.flaticon.com/icons/svg/25/25231.svg',
        },
        {
          url: 'https://www.facebook.com',
          title: 'Facebook',
          description: '',
          screenshot: 'http://cdn.ilovefreesoftware.com/wp-content/uploads/2013/06/facebookdesktopversion.png',
          icon: 'https://image.flaticon.com/icons/png/512/124/124010.png',
        },
        {
          url: 'https://www.youtube.com',
          title: 'YouTube',
          description: '',
          screenshot: 'https://www.mhthemes.com/support/files/2015/10/YouTube.png',
          icon: 'https://cdn1.iconfinder.com/data/icons/logotypes/32/youtube-256.png',
        },
        {
          url: 'https://www.github.com',
          title: 'GitHub',
          description: 'Build for developers',
          screenshot: 'https://scontent-waw1-1.xx.fbcdn.net/v/t1.0-9/24899862_2050574158507064_8530629417294747664_n.jpg?oh=eba9b82613dacc8a41e99d63ca32c845&oe=5ACD27C8',
          icon: 'https://image.flaticon.com/icons/svg/25/25231.svg',
        },
        {
          url: 'https://www.facebook.com',
          title: 'Facebook',
          description: '',
          screenshot: 'http://cdn.ilovefreesoftware.com/wp-content/uploads/2013/06/facebookdesktopversion.png',
          icon: 'https://image.flaticon.com/icons/png/512/124/124010.png',
        },
        {
          url: 'https://www.youtube.com',
          title: 'YouTube',
          description: '',
          screenshot: 'https://www.mhthemes.com/support/files/2015/10/YouTube.png',
          icon: 'https://cdn1.iconfinder.com/data/icons/logotypes/32/youtube-256.png',
        }
      ]
    })
  }

  // TODO: Load from JSON file
  loadSections () {
    this.setState({
      sections: [
        {
          date: 'Today',
          items: [
            {
              title: 'Youtube',
              url: 'https://www.youtube.com',
              icon: 'https://cdn1.iconfinder.com/data/icons/logotypes/32/youtube-256.png',
              time: '10.47'
            }
          ]
        }
      ]
    })
  }

  render () {
    return (
      <div className='history'>
        <ToolBar />
        <Cards items={this.state.cards} />
        {
          this.state.sections.map((data, key) => {
            return <Section data={data} key={key} />
          })
        }
      </div>
    )
  }
}