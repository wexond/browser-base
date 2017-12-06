import Component from 'inferno-component'

import MenuItem from '../MenuItem'

export default class Menu extends Component {
  render () {
    return (
      <div className='menu'>
          {
            this.props.items.map((data, key) => {
              if (data.type === 'separator') {
                return <div className='separator' />
              } else {
                return <MenuItem title={data.title} icon={data.icon} onClick={data.onClick} />
              }
            })
          }
      </div>
    )
  }
}