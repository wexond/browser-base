import React from 'react'

export default class Item extends React.Component {
  componentDidMount () {
    if (this.refs.itemAction != null) this.action = this.refs.itemAction.refs.action
    this.expandableContent = this.refs.expandableContent
  }

  render() {
    const {
      title,
      description,
      cursor
    } = this.props

    const style = {
      cursor: cursor
    }

    const onClick = (e) => {
      if (typeof this.props.onClick === 'function') this.props.onClick(e, this.action)
    }

    return (
      <div className='section-item' style={style} onClick={onClick}>
        <div className='horizontal'>
          <div className='title'>
            {title}
          </div>
          {React.Children.map(this.props.children, child => {
            if (child.type.name === 'ItemAction') {
              return React.cloneElement(child, {ref: 'itemAction'})
            }
          })}
        </div>

        <div style={{clear: 'both'}} />
        
        <div className='description'>{description}</div>

        {React.Children.map(this.props.children, child => {
          if (child.type.name === 'ExpandableContent') {
            return React.cloneElement(child, {ref: 'expandableContent'})
          } else if (child.type.name !== 'ItemAction') {
            return React.cloneElement(child)
          }
        })}
      </div>
    )
  }
}