import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../../stores/store'

import BackgroundExtension from '../BackgroundExtension'

@observer
export default class BackgroundExtensions extends React.Component {
  render () {
    return (
      <div className='background-extensions'>
        {
          Store.extensions.map((item) => {
            if (item.background != null && item.background.page != null) {
              return <BackgroundExtension key={item.id} data={item} />
            }
          })
        }
      </div>
    )
  }
}