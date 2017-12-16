import React from 'react'

import Item from '../HistoryItem'

export default class HistorySection extends React.Component {
  render () {
    return (
      <div className='history-section'>
        <div className='subheader'>
          {this.props.data.title}
        </div>
        {
          this.props.data.items.map((data, key) => {
            return <Item data={data} key={key} />
          })
        }
      </div>
    )
  }
}