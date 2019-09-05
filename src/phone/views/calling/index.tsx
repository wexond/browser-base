import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CALL_OUT_STATE, ANSWERED_STATE, CallState } from '../../stateMachines/callStateMachine'
import styled from 'styled-components'
import { HangupPhoneIcon } from '../phoneButtons'
import { FlexColumnCenter, FlexRowCenter } from '../flex'

interface CallingProps {
  mode: CallState,
  hangup: () => void,
  className?: string,
}

interface CallingState {
  elapsedTime: string,
  firstTick: number, // timestamp
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
`

const StyledIcon = styled(FontAwesomeIcon)`
  width: 50px;
  color: white;
`

export class Calling extends React.Component<CallingProps, CallingState> {
  constructor(props: CallingProps) {
    super(props)
    this.state = { elapsedTime: formatElapsedTime(0), firstTick: Date.now() }
    requestAnimationFrame(this.tick.bind(this))
  }

  tick() {
    this.setState(state => {
      const now = Date.now()
      const diff = now - state.firstTick

      return { elapsedTime: formatElapsedTime(diff) }
    })
    requestAnimationFrame(this.tick.bind(this))
  }

  render() {
    let body = (<StyledIcon icon="phone" />)

    if (this.props.mode === CALL_OUT_STATE) {
      body = (
        <FlexRowCenter>
          <StyledIcon icon="phone-alt" />
          <StyledIcon icon="long-arrow-alt-right" />
        </FlexRowCenter>
      )
    } else if (this.props.mode === ANSWERED_STATE) {
      body = (
        <FlexRowCenter>
          <StyledIcon icon="long-arrow-alt-right" />
          <StyledIcon icon="phone" />
        </FlexRowCenter>
      )
    }
    return (
      <FlexColumnCenter className={this.props.className}>
        {body}
        <ElapsedTime>{this.state.elapsedTime}</ElapsedTime>
        <HangupPhoneIcon hangup={this.props.hangup} />
      </FlexColumnCenter>
    )
  }
}
