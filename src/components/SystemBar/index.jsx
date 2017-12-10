import Component from 'inferno-component'

import Controls from '../Controls'

import Store from '../../store'
import { connect } from 'inferno-mobx'

import Colors from '../../utils/colors'

@connect
export default class SystemBar extends Component {
  constructor () {
    super()
  }

  render () {
    let backColor = Colors.shadeColor(Store.backgroundColor, -0.2)

    if (Store.backgroundColor === '#fff') backColor = Colors.shadeColor(Store.backgroundColor, -0.1)

    return (
      <div className={'system-bar ' + Store.foreground} style={{backgroundColor: backColor}}>
        {this.props.children}
        <Controls />
        <div className='border-bottom' />
      </div>
    )
  }
}
