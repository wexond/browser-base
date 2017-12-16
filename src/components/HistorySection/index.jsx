import React from 'react'

import Item from '../HistoryItem'

export default class HistorySection extends React.Component {
  onItemSelect = (flag, data) => {
    const history = this.props.getHistory()

    if (flag) history.selectedUrls.push(data.url)
    else history.selectedUrls.splice(history.selectedUrls.indexOf(data.url), 1)
  }

  render () {
    return (
      <div className='history-section'>
        <div className='subheader'>
          {this.props.data.title}
        </div>
        {
          this.props.data.items.map((data, key) => {
            return <Item data={data} key={key} onSelect={this.onItemSelect} />
          })
        }
      </div>
    )
  }
}