import Component from 'inferno-component'

import ToolBar from '../HistoryToolBar'
import Cards from '../HistoryCards'

export default class History extends Component {
  render () {
    return (
      <div className='history'>
        <ToolBar />
        <Cards />
      </div>
    )
  }
}