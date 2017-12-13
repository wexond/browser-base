import Component from 'inferno-component'

export default class HistoryItem extends Component {
  render () {
    const iconStyle = {
      backgroundImage: `url(${this.props.data.icon})`
    }

    return (
      <div class='history-section-item'>
        <div class='check-box in-line' />
        <div class='time in-line'>
          {this.props.data.time}
        </div>
        <div class='icon in-line' style={iconStyle} />
        <a href={this.props.data.url} class='title in-line'>
          {this.props.data.title}
        </a>
        <div class='domain in-line'>
          www.youtube.com
        </div>
      </div>
    )
  }
}
