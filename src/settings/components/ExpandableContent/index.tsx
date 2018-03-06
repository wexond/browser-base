import React from 'react'

interface Props {

}

interface State {
  toggled: boolean,
}

export default class ExpandableContent extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    
    this.state = {
      toggled: false
    }
  }

  public toggle = (flag: boolean) => {
    this.setState({toggled: flag})
  }

  public render(): JSX.Element {
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
