import React from 'react'

import Card from '../Card'

import Store from '../../history-store'
import { observer } from 'mobx-react'

@observer
export default class Cards extends React.Component {
  constructor () {
    super()

    this.state = {
      width: 0
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.resizeContainer)
    this.resizeContainer()
  }

  resizeContainer = () => {
    let i = 1

    this.setState({
      width: this.getWidth()
    })
  }

  getWidth () {
    if (window.innerWidth > 800) {
      return 800
    } else if (window.innerWidth > 528) {
      return 528
    } else {
      return this.props.cardWidth + this.props.cardGap * 2
    }
  }

  render () {
    const style = {
      width: this.state.width
    }

    return (
      <div className='cards-container' style={style}>
        {
          Store.cards.map((data, key) => {
            return <Card data={data} key={key} image={this.props.cardsImage} description={this.props.cardsDescription} />
          })
        }
      </div>
  )
}
}

Cards.defaultProps = {
  cardWidth: 256,
  cardGap: 16,
  cardsImage: false,
  cardsDescription: false
}