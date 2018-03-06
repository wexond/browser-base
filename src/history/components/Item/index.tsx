import React from 'react'

import Checkbox from '../../Material/Checkbox'

import Store from '../../stores/history'
import { observer } from 'mobx-react'

import Section from "../Section"

interface Props {
  data: any,
  section: Section
}

interface State {
  
}

@observer
export default class HistoryItem extends React.Component<Props, State> {
  
  checkbox: Checkbox
  id: number
  
  componentDidMount() {
    this.id = this.props.data.id
  }

  render (): JSX.Element {
    const {
      data,
      section
    } = this.props

    const iconStyle = {
      backgroundImage: `url(${data.favicon})`
    }

    const sectionIndex = section.props.index

    const onCheck = (flag: boolean, checkbox: Checkbox) => {
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
        <Checkbox ref={(r: Checkbox) => { this.checkbox = r }} onCheck={onCheck} sectionIndex={sectionIndex} data={data} />
        <div className='time'>
          {data.date.split(' ')[1].split(':')[0] + ':' + data.date.split(' ')[1].split(':')[1]}
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