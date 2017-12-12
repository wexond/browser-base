import Component from 'inferno-component'

import Card from '../HistoryCard'
import ToolBar from '../HistoryToolBar'

export default class History extends Component {
  constructor () {
    super()

    this.state = {
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
      ],
      cardsContainerWidth: 256
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.resizeCardsContainer)

    this.resizeCardsContainer()
  }

  resizeCardsContainer = () => {
    const count = this.getMaxCardsCount()
    const width = this.calculateWidth(count)

    if (this.state.cardsContainerWidth !== width) {
      this.setState({
        cardsContainerWidth: width
      })
    }
  }

  getMaxCardsCount () {
    let i = 1

    while (true) {
      if (this.calculateWidth(i) >= window.innerWidth) return (i - 1 ) > 3 ? 3 : (i - 1)
      else i++
    }

    return -1
  }

  calculateWidth (count) {
    return this.props.cardWidth * count + this.props.cardMargin * count + 16
  }

  render () {
    const cardsContainerStyle = {
      maxWidth: this.state.cardsContainerWidth
    }

    return (
      <div className='history'>
        <ToolBar />
        <div class='cards-container' style={cardsContainerStyle}>
          {
            this.state.cards.map((data, key) => {
              return <Card data={data} key={key} />
            })
          }
        </div>
      </div>
    )
  }
}

History.defaultProps = {
  cardWidth: 256,
  cardMargin: 32
}