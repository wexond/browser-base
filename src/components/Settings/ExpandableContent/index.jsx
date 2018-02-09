import React from 'react'

export default class ExpandableContent extends React.Component {
  constructor () {
    super()
    
    this.state = {
      height: 0
    }
  }

  toggle = (flag) => {
    this.setState({height: (flag) ? this.refs.root.scrollHeight : 0})
  }

  render() {
    const {
      height
    } = this.state

    const style = {
      height: height
    }

    return (
      <div ref='root' className='expandable-content' style={style}>
        {this.props.children}
      </div>
    )
  }
}