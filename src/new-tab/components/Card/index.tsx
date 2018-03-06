import React from 'react'

import Preloader from '../../Material/Preloader'

import NewTabHelper from '../../utils/new-tab'

interface Props {
  data: any,
}

interface State {
  loading: boolean,
}

export default class Card extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)

    this.state = {
      loading: true
    }
  }

  public async componentDidMount () {
    await NewTabHelper.loadPicture(this.props.data.urlToImage)

    this.setState({
      loading: false
    })
  }

  public render (): JSX.Element {
    const {
      url,
      title,
      source,
      urlToImage,
      time,
      favicon
    } = this.props.data
    
    const faviconStyle = {
      backgroundImage: `url(${favicon})`
    }

    const imageStyle = {
      backgroundImage: this.state.loading ? 'unset' : `url(${urlToImage})`,
      opacity: this.state.loading ? 0 : 1
    }
    
    const preloaderStyle = {
      display: this.state.loading ? 'block' : 'none'
    }

    return (
      <a href={url}>
        <div className='new-tab-card'>
          <div className='info-container'>
            <div className='title'>
              {title}
            </div>
            <div className='site-container'>
              <div className='favicon' style={faviconStyle} />
              <span className='domain'>
                {source.name}
              </span>
              <span className='time'>
                - {time}
              </span>
            </div>
          </div>
          <div className='image' style={imageStyle} />
          <div className='preloader-container' style={preloaderStyle}>
            <Preloader />
          </div>
        </div>
      </a>
    )
  }
}