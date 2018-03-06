import React from 'react'

import * as windowActions from '../../actions/window'

import { observer } from 'mobx-react'
import Store from '../../store'

interface Props {

}

interface State {

}

@observer
export default class Controls extends React.Component<Props, State> {
  public render(): JSX.Element {
    return (
      <div className={ 'controls ' + Store.foreground }>
        <div className='close' onClick={ windowActions.close }>
          <div className='icon' />
        </div>
        <div className='maximize' onClick={ windowActions.maximize }>
          <div className='icon' />
        </div>
        <div className='minimize' onClick={ windowActions.minimize }>
          <div className='icon' />
        </div>
      </div>
    )
  }
}