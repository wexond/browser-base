import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CALL_OUT_STATE, ANSWERED_STATE, CallState } from '../../stateMachines/callStateMachine'
import styled from 'styled-components'
import { HangupPhoneIcon } from '../phoneButtons'
import { FlexRowCenter } from '../flex'
import { Translator } from '../../../translator/translator'

import './Calling.css'

interface CallingProps {
  mode: CallState
  hangup: () => void
  mute: () => void
  className?: string
  translator: Translator
  lang?: string
  number?: string
  callingNumber: string
}

interface CallingState {
  elapsedTime: string
  displayKeyPad: boolean
}

function formatElapsedTime(elapsedTime: number) {
  const elapsedTimeInSeconds = elapsedTime / 1000
  const seconds = Math.floor(elapsedTimeInSeconds % 60)
  const elapsedTimeInMinutes = (elapsedTimeInSeconds - seconds) / 60
  const minutes = Math.floor(elapsedTimeInMinutes % 60)
  const hours = Math.floor(elapsedTimeInSeconds / 3600)

  function pad(num: number) {
    let padded = `${num}`

    while (padded.length < 2) {
      padded = `0${padded}`
    }

    return padded
  }

  let formatted = `${pad(minutes)}:${pad(seconds)}`

  if (hours > 0) {
    formatted = `${pad(hours)}:${formatted}`
  }

  return formatted
}

const ElapsedTime = styled(FlexRowCenter)`
  color: white;
  flex-grow: 2;
  font-size: 24px;
  font-family: 'Roboto', Arial, Helvetica, sans-serif;
  font-weight: regular;
  text-align: center;
  width: 100%;
`

const StyledIcon = styled(FontAwesomeIcon)`
  width: 50px;
  color: white;
`

export class Calling extends React.Component<CallingProps, CallingState> {
  private tickRequest: number
  private readonly firstTick: number

  constructor(props: CallingProps) {
    super(props)
    this.firstTick = Date.now()
    this.state = { elapsedTime: formatElapsedTime(0), displayKeyPad: false }
    this.tickRequest = requestAnimationFrame(this.tick.bind(this))
  }

  tick() {
    const elapsedTime = Date.now() - this.firstTick
    this.setState({ elapsedTime: formatElapsedTime(elapsedTime) })
    this.tickRequest = requestAnimationFrame(this.tick.bind(this))
  }

  render() {
    let title = (<StyledIcon icon="phone" />)

    if (this.props.mode === CALL_OUT_STATE) {
      title = (
        <h2 className="title">{this.props.translator.translate('Calling', this.props.lang)}</h2>
      )
    }
    if (this.props.mode === ANSWERED_STATE) {
      title = (
        <h2 className="title">{this.props.translator.translate('Answered', this.props.lang)}...</h2>
      )
    }
    return (
      <div className="calling-container">
          {title}
          <div>
            <h1 className="phoneNumber">{this.props.callingNumber}</h1>
            <ElapsedTime><span>{this.state.elapsedTime}</span></ElapsedTime>
          </div>
          <FlexRowCenter className={this.props.className}>
            {/*<div>
              <MuteMicIcon mute={this.props.mute}/>
              <span className="buttonSpan">Mute</span>
            </div>
             <div>
              <KeyPadIcon displayKeyPad={this.props.displayKeyPad}/>
              <span className="buttonSpan">Keypad</span>
            </div>
            <div>
              <SpeakerIcon speaker={this.props.speaker}/>
              <span className="buttonSpan disabled">Speaker</span>
            </div> */}
          </FlexRowCenter>
          <HangupPhoneIcon hangup={this.props.hangup} />
        </div>
    )
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.tickRequest)
  }
}
