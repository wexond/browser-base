import * as React from 'react'
import { Incoming } from './incoming'
import { Unavailable } from './unavailable'
import { OffHook } from './offHook'
import { Calling } from './calling'
import { CallState, OFF_HOOK_STATE, INCOMING_STATE, ANSWERED_STATE, CALL_OUT_STATE } from '../stateMachines/callStateMachine'
import styled from 'styled-components'
import { robotoRegular } from '~/shared/mixins'
import { Translator } from '../../translator/translator'

interface MainViewProps {
  callState: CallState | null
  call: (callNumber: string) => void
  answer: () => void
  hangup: () => void
  waiting: boolean
  translator: Translator
  lang?: string
}

const StyledCalling = styled(Calling)`
  height: 40%;
  width: 70%;
  ${robotoRegular}
`

export class MainView extends React.Component<MainViewProps> {
  render() {
    let template: JSX.Element

    switch (this.props.callState) {
      case OFF_HOOK_STATE:
        template = (<OffHook translator={this.props.translator} lang={this.props.lang} call={this.props.call} />)
        break
      case INCOMING_STATE:
        template = (<Incoming answer={this.props.answer} hangup={this.props.hangup} />)
        break
      case ANSWERED_STATE:
        template = (<StyledCalling mode={ANSWERED_STATE} hangup={this.props.hangup} />)
        break
      case CALL_OUT_STATE:
        template = (<StyledCalling mode={CALL_OUT_STATE} hangup={this.props.hangup} />)
        break
      default:
        template = (<Unavailable translator={this.props.translator} lang={this.props.lang} />)
    }
    return template
  }
}
