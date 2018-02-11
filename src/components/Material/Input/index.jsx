import React from 'react'

export default class Input extends React.Component {
  constructor () {
    super()

    this.state = {
      focused: false,
      value: ''
    }
  }

  componentDidMount () {
    this.setState({value: this.input.value})
  }

  getValue () {
    return this.input.value
  }

  setValue (str) {
    this.input.value = str
  }

  focus = () => {
    setTimeout(() => {
      this.input.focus()
    })
  }

  render () {
    const {
      focused,
      value
    } = this.state

    const {
      className,
      style,
      defaultValue,
      onClick,
      onMouseDown,
      onInput,
      onKeyPress,
      placeholder
    } = this.props

    const isEmpty = this.input != null ? (this.input.value.length === 0) : false

    const onFocus = () => {
      if (isEmpty) this.setState({focused: true})
    }

    const onBlur = () => {
      if (isEmpty) this.setState({focused: false})
    }

    const onChange = () => {
      this.setState({value: this.input.value})
    }

    const inputEvents = {
      onKeyPress: onKeyPress,
      onInput: onInput,
      onMouseDown: onMouseDown,
      onClick: onClick,
      onFocus: onFocus,
      onBlur: onBlur,
      onChange: onChange
    }

    let labelClassName = 'label'

    if (!focused && value === '') {
      labelClassName += ' hint'
    }

    if (focused) {
      labelClassName += ' focused'
    }

    return (
      <div className={className} style={style}>
        <div className='input' style={{height: this.props.hint != null ? 48 : 30}} >
          <div className={labelClassName}>{this.props.hint}</div>
          <input ref={(r) => { this.input = r }} {...inputEvents} defaultValue={defaultValue} placeholder={placeholder}></input>
          <div className='line'></div>
          <div className={'thick-line ' + ((focused) ? 'show' : '')}></div>
        </div>
      </div>
    )
  }
}