import React from 'react'

import Checkbox from '../../Checkbox'

import Store from '../../../stores/history'
import { observer } from 'mobx-react'

@observer
export default class HistoryItem extends React.Component {
  render () {
    const {
      data,
      section
    } = this.props

    const iconStyle = {
      backgroundImage: `url(${data.favicon})`
    }

    const sectionIndex = section.props.index

    const onCheck = (flag, checkbox) => {
      if (flag) {
        const checked = Store.history.getSelectedCheckBoxes(sectionIndex)

        if (checked.length + 1 === section.items.length) {
          section.checkbox.setState({checked: true})
        }

        Store.selectedItems.push(checkbox)
      } else {
        section.checkbox.setState({checked: false})
        Store.selectedItems.splice(Store.selectedItems.indexOf(checkbox), 1)
      }
    }

    return (
      <div className='history-section-item'>
        <Checkbox ref={(r) => { this.checkbox = r }} onCheck={onCheck} sectionIndex={sectionIndex} data={data} />
        <div className='time'>
          {data.time}
        </div>
        <div className='icon' style={iconStyle} />
        <a href={data.url} className='title'>
          {data.title}
        </a>
        <div className='domain'>
          {data.domain}
        </div>
      </div>
    )
  }
}