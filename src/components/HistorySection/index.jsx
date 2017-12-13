import React from 'react'

import Item from '../HistoryItem'

export default class HistorySection extends React.Component {
  render () {
    return (
      <div class='history-section'>
        <div class='subheader'>
          {this.props.data.date}
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
