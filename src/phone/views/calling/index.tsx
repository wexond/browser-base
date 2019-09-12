import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CALL_OUT_STATE, ANSWERED_STATE, CallState, OUTGOING_STATE } from '../../stateMachines/callStateMachine'
import styled from 'styled-components'
import { HangupPhoneIcon } from '../phoneButtons'
import { FlexRowCenter, FlexColumnCenter } from '../flex'
import { Translator } from '../../../translator/translator'

import './Calling.css'
import { robotoMedium } from '~/shared/mixins'
import { RemoteCodes } from '../../remote'

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

const Rotating = styled(FontAwesomeIcon)`
  width: 50px;
  color: white;
  animation: rotate 2s linear infinite;
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`

const PhoneNumber = styled.h1`
  color: white;
  ${robotoMedium}
`

export class Calling extends React.Component<CallingProps, CallingState> {
  private tickRequest: number | null = null
  private firstTick: number

  private onKeyDown(e: KeyboardEvent) {
    if (e.code === RemoteCodes.HANGUP_GESTURE || e.code === RemoteCodes.HANGUP_KEY) {
      this.props.hangup()
    }
  }

  constructor(props: CallingProps) {
    super(props)
    this.state = { elapsedTime: formatElapsedTime(0), displayKeyPad: false }

    this.onKeyDown = this.onKeyDown.bind(this)
  }

  startTick() {
    this.firstTick = Date.now()
    this.tickRequest = requestAnimationFrame(this.tick.bind(this))
  }

  tick() {
    const elapsedTime = Date.now() - this.firstTick
    this.setState({ elapsedTime: formatElapsedTime(elapsedTime) })
    this.tickRequest = requestAnimationFrame(this.tick.bind(this))
  }

  render() {
    let title
    let elapsedTime

    if ([ANSWERED_STATE, CALL_OUT_STATE].includes(this.props.mode)) {
      elapsedTime = (<ElapsedTime><span>{this.state.elapsedTime}</span></ElapsedTime>)
      this.startTick()
    } else {
      elapsedTime = (<Rotating icon="circle-notch" spin />)
    }

    if ([OUTGOING_STATE, CALL_OUT_STATE].includes(this.props.mode)) {
      title = (
        <h2 className="title">{this.props.translator.translate('Calling', this.props.lang)}</h2>
      )
    } else if (this.props.mode === ANSWERED_STATE) {
      title = (
        <h2 className="title">{this.props.translator.translate('Answered', this.props.lang)}...</h2>
      )
    } else {
      title = (<h2 className="title"></h2>)
    }
    return (
      <div className="calling-container">
          {title}
          <FlexColumnCenter>
            <PhoneNumber>{this.props.callingNumber}</PhoneNumber>
            { elapsedTime }
          </FlexColumnCenter>
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

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
    if (this.tickRequest) {
      cancelAnimationFrame(this.tickRequest)
    }
  }
}
