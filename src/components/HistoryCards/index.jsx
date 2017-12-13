import Component from 'inferno-component'

import Card from '../HistoryCard'

export default class HistoryCards extends Component {
  constructor () {
    super()

    this.state = {
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
        <div class='cards-container' style={cardsContainerStyle}>
          {
            this.props.items.map((data, key) => {
              return <Card data={data} key={key} />
            })
          }
        </div>
    )
  }
}

HistoryCards.defaultProps = {
  cardWidth: 256,
  cardMargin: 32,
  items: []
}