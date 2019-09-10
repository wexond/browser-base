import * as React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './OtherButtons.css'

const StyledButton = styled.div`
  border: 1px solid rgba(255,255,255,0.8);
  color: white;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 12px;
`

const StyledIcon = styled(FontAwesomeIcon)`
  width: 36px;
`

interface MuteMicProps {
  mute: () => void
}

export class MuteMicIcon extends React.Component<MuteMicProps> {
  render() {
    return (
      <StyledButton onClick={this.props.mute}>
        <StyledIcon icon="microphone-slash" />
      </StyledButton>
    )
  }
}

interface DisplayKeyPad {
  displayKeyPad: () => void
}

export class KeyPadIcon extends React.Component<DisplayKeyPad> {
  render() {
    return (
      <StyledButton onClick={this.props.displayKeyPad}>
        <StyledIcon icon="th" />
      </StyledButton>
    )
  }
}

interface EnableSpeaker {
  speaker: () => void
}

export class SpeakerIcon extends React.Component<EnableSpeaker> {
  render() {
    return (
      <StyledButton className="disabled" onClick={this.props.speaker}>
        <StyledIcon icon="volume-up" />
      </StyledButton>
    )
  }
}
