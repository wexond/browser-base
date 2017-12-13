import Component from 'inferno-component'

import Checkbox from '../Checkbox'

export default class HistoryItem extends Component {
  render () {
    const iconStyle = {
      backgroundImage: `url(${this.props.data.icon})`
    }

    return (
      <div class='history-section-item'>
        <Checkbox />
        <div class='time'>
          {this.props.data.time}
        </div>
        <div class='icon' style={iconStyle} />
        <a href={this.props.data.url} class='title'>
          {this.props.data.title}
        </a>
        <div class='domain'>
          www.youtube.com
        </div>
      </div>
    )
  }
}
