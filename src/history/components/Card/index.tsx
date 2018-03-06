import React from 'react'

interface Props {
  fullInfo?: boolean,
  data: any,
  image?: boolean,
  description?: boolean,
}

interface State {

}

export default class Card extends React.Component<Props, State> {

  public static defaultProps: Partial<Props> = {
    image: false,
    description: false,
    fullInfo: false
  }

  public render(): JSX.Element {
    const {
      fullInfo,
      data,
    } = this.props

    const faviconStyle = {
      backgroundImage: `url(${data.favicon}`
    }

    return (
      <a href={this.props.data.url}>
        <div className={'history-card ' + (fullInfo ? 'full-info' : '')}>
          {fullInfo && <div className='image' style={{ backgroundImage: `url(${data.ogdata.image})` }} />}
          {!fullInfo && <div className='favicon' style={faviconStyle} />}
          <div className='info-container'>
            <span className='title'>
              {data.title}
            </span>
            {data.ogdata != null && data.ogdata.description != null &&
              <span className='description'>
                {data.ogdata.description}
              </span>
            }
          </div>
          {fullInfo &&
            <div className='site-container'>
              <div className='favicon' style={faviconStyle} />
              <span className='domain'>
                {data.domain}
              </span>
            </div>
          }
        </div>
      </a>
    )
  }
}