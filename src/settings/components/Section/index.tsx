import React from 'react'

interface Props {
  className?: string,
  title: string,
}

interface State {

}

export default class Section extends React.Component<Props, State> {
  public render(): JSX.Element {
    const {
      className,
      title,
      children
    } = this.props

    return (
      <div className={'section ' + (className != null ? className : '')}>
        <div className='subheader'>
          {title}
        </div>
        <div className='section-content'>
          {children}
        </div>
      </div>
    )
  }
}