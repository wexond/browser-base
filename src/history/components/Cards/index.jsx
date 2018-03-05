import React from 'react'

import Card from '../Card'

import Store from '../../stores/history'
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
      return this.props.cardWidth
    }
  }

  render () {
    const style = {
      width: this.state.width
    }

    return (
      <div>
        { Store.cards.fullInfo.length > 0 &&
         <div className='cards-container' style={style}>
            {
              Store.cards.fullInfo.map((data, key) => {
                return <Card fullInfo={true} data={data} key={key} />
              })
            }
          </div>
        }
        <div className='cards-container' style={style}>
          {
            Store.cards.lessInfo.map((data, key) => {
              return <Card fullInfo={false} data={data} key={key} />
            })
          }
        </div>
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