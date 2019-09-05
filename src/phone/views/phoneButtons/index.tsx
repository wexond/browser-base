import * as React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const StyledPhone = styled.div`
  color: white;
  width: 75px;
  height: 75px;
  border-radius: 50%;
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledHangupPhone = styled(StyledPhone)`
  background-color: red;
`
const StyledIcon = styled(FontAwesomeIcon)`
  width: 50px;
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
  background-color: green;
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
