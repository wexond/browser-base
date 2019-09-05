import * as React from 'react'
import { FlexRowSpaceEvenly } from '../flex'
import { AnswerPhoneIcon, HangupPhoneIcon } from '../phoneButtons'

interface IncomingProps {
  answer: () => void
  hangup: () => void
}

export class Incoming extends React.Component<IncomingProps> {
  render() {
    return (
      <FlexRowSpaceEvenly>
        <AnswerPhoneIcon answer={this.props.answer} />
        <HangupPhoneIcon hangup={this.props.hangup} />
      </FlexRowSpaceEvenly>
    )
  }
}
