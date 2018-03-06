import React from 'react'

import Checkbox from '../../Material/Checkbox'
import Item from '../Item'

import Store from '../../stores/history'
import { observer } from 'mobx-react'

interface Props {
  data: any,
  index: number,
}

interface State {

}

@observer
export default class Section extends React.Component<Props, State> {
  
  items: any[]
  checkbox: Checkbox

  constructor(props: Props) {
    super(props)

    this.items = []
  }

  render (): JSX.Element {
    const {
      data
    } = this.props

    this.items = []

    const onAllCheck = (flag: boolean) => {
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
            <Checkbox ref={(r: Checkbox) => { this.checkbox = r }} onCheck={onAllCheck} />
          </div>
          {data.title}
        </div>
        {
          data.items.map((data: any, key: string) => {
            return <Item ref={(r) => { this.items.push(r) }} data={data} key={key} section={this} />
          })
        }
      </div>
    )
  }
}