import React from 'react'

import ItemAction from '../ItemAction'
import ExpandableContent from '../ExpandableContent'
import Switch from '../../Material/Switch'

interface Props {
  title: string,
  description?: string,
  cursor: any,
  onClick?: any,
}

interface State {

}

export default class Item extends React.Component<Props, State> {
  
  private itemActions: any[]
  private expandableContent: ExpandableContent

  constructor(props: Props) {
    super(props)

    this.itemActions = []
  }

  public render(): JSX.Element {
    const {
      title,
      description,
      cursor
    } = this.props

    const style = {
      cursor: cursor
    }

    const onClick = (e: any) => {
      if (typeof this.props.onClick === 'function') { this.props.onClick(e) }

      this.itemActions = this.itemActions.filter(Boolean)

      for (var i = 0; i < this.itemActions.length; i++) {
        if (this.itemActions[i].action.constructor === Switch) {
          this.itemActions[i].action.toggle(!this.itemActions[i].action.state.toggled)
        }
      }

      if (this.expandableContent != null) {
        this.expandableContent.toggle(!this.expandableContent.state.toggled)
      }
    }

    this.itemActions = []

    return (
      <div className='section-item' style={style} onClick={onClick}>
        <div className='row'>
          <div className='info'>
            <div className='title'>
              {title}
            </div>
            <div className='description'>
              {description}
            </div>
          </div>
          <div className='actions'>
            {React.Children.map(this.props.children, child => {
              if (child.type === ItemAction) {
                return React.cloneElement(child, {ref: (r: any) => { this.itemActions.push(r) }})
              }
            })}
          </div>
        </div>
        {React.Children.map(this.props.children, child => {
          if (child.type === ExpandableContent) {
            return React.cloneElement(child, {ref: (r: any) => { this.expandableContent = r }})
          } else if (child.type !== ItemAction) {
            return React.cloneElement(child)
          }
        })}
      </div>
    )
  }
}