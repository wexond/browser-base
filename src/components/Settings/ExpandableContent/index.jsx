import React from 'react'

export default class ExpandableContent extends React.Component {
  constructor () {
    super()
    
    this.state = {
      toggled: false
    }
  }

  toggle = (flag) => {
    this.setState({toggled: flag})
  }

  render() {
    const {
      toggled
    } = this.state

    const style = {
      height: (toggled) ? this.refs.root.scrollHeight : 0
    }

    return (
      <div ref='root' className='expandable-content' style={style}>
        {this.props.children}
      </div>
    )
  }
}
