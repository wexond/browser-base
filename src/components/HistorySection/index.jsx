import React from 'react'

import Checkbox from '../Checkbox'
import Item from '../HistoryItem'

import Store from '../../history-store'
import { observer } from 'mobx-react'

@observer
export default class HistorySection extends React.Component {
  constructor () {
    super()

    this.items = []
  }

  render () {
    const onCheck = (flag) => {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i] != null) {
          const data = this.items[i].props.data
          data.checkbox = this.items[i].checkbox
          if (flag) {
            data.checkbox.setState({checked: true})
            Store.selectedItems.push(data)
          } else {
            data.checkbox.setState({checked: false})
            Store.selectedItems.splice(Store.selectedItems.indexOf(data), 1)
          }
        }
      }
    }

    this.items = []

    return (
      <div className='history-section'>
        <div className='subheader'>
          <div className='section-checkbox'>
            <Checkbox ref={(r) => { this.checkbox = r }} onCheck={onCheck} />
          </div>
          {this.props.data.title}
        </div>
        {
          this.props.data.items.map((data, key) => {
            return <Item ref={(r) => { this.items.push(r) }} data={data} key={key} section={this} />
          })
        }
      </div>
    )
  }
}