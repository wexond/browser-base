import * as React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const StyledPhone = styled.div`
  color: rgba(255,255,255,0.8);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #FF4437;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledHangupPhone = styled(StyledPhone)`
  background-color: red;
`
const StyledIcon = styled(FontAwesomeIcon)`
  width: 36px;
`

interface HangupPhoneProps {
  hangup: () => void
}

export class HangupPhoneIcon extends React.Component<HangupPhoneProps> {
  render() {
    return (
      <StyledHangupPhone onClick={this.props.hangup}>
        <StyledIcon icon="phone-slash" />
      </StyledHangupPhone>
    )
  }
}

const StyledAnswerPhone = styled(StyledPhone)`
  background-color: #56DE6F;
`

interface AnswerPhoneProps {
  answer: () => void
}

export class AnswerPhoneIcon extends React.Component<AnswerPhoneProps> {
  render() {
    return (
      <StyledAnswerPhone onClick={this.props.answer}>
        <StyledIcon icon="phone" />
      </StyledAnswerPhone>
    )
  }
}
