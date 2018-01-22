import React from 'react'

import Checkbox from '../Checkbox'
import Item from '../HistoryItem'

import Store from '../../stores/history'
import { observer } from 'mobx-react'

@observer
export default class HistorySection extends React.Component {
  constructor () {
    super()

    this.items = []
  }

  render () {
    const {
      data
    } = this.props

    this.items = []

    const onAllCheck = (flag) => {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i] != null) {
          const checkbox = this.items[i].checkbox

          if (flag) {
            if (!checkbox.state.checked) {
              checkbox.setState({checked: true})
              Store.selectedItems.push(checkbox)
            }
          } else {
            checkbox.setState({checked: false})
            Store.selectedItems.splice(Store.selectedItems.indexOf(checkbox), 1)
          }
        }
      }
    }

    return (
      <div className='history-section'>
        <div className='subheader'>
          <div className='section-checkbox'>
            <Checkbox ref={(r) => { this.checkbox = r }} onCheck={onAllCheck} />
          </div>
          {data.title}
        </div>
        {
          data.items.map((data, key) => {
            return <Item ref={(r) => { this.items.push(r) }} data={data} key={key} section={this} />
          })
        }
      </div>
    )
  }
}