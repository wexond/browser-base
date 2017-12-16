import React from 'react'

import Card from '../HistoryCard'

export default class HistoryCards extends React.Component {
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

    while (true) {
      if (this.calculateWidth(i) >= window.innerWidth) {
        const count = (i - 1 ) > 3 ? 3 : (i - 1)

        this.setState({
          width: this.calculateWidth(count)
        })

        break
      } else {
        i++
      }
    }
  }

  calculateWidth (count) {
    return this.props.cardWidth * count + this.props.cardGap * (count - 1)
  }

  render () {
    const style = {
      width: this.state.width
    }

    return (
        <div className='cards-container' style={style}>
          {
            this.props.items.map((data, key) => {
              return <Card data={data} key={key} image={false} />
            })
          }
        </div>
    )
  }
}

HistoryCards.defaultProps = {
  cardWidth: 256,
  cardGap: 16
}