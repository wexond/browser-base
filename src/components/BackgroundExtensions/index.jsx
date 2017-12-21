import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../store'

import BackgroundExtension from '../BackgroundExtension'

@observer
export default class BackgroundExtensions extends React.Component {
  render () {
    return (
      <div className='background-extensions'>
        {
          Store.extensions.map((item) => {
            return <BackgroundExtension key={item.id} data={item} />
          })
        }
      </div>
    )
  }
}