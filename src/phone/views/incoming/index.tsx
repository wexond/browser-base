import * as React from 'react'
import { FlexRowSpaceEvenly } from '../flex'
import { AnswerPhoneIcon, HangupPhoneIcon } from '../phoneButtons'
import './Incoming.css'

interface IncomingProps {
  answer: () => void
  hangup: () => void
}

export class Incoming extends React.Component<IncomingProps> {
  render() {
    return (
      <div className="incoming-call-container">
        <h2 className="title">Incoming Call</h2>
        {/* <h1 className="phoneNumber">+32 0492 25 41 79</h1> */}
        <FlexRowSpaceEvenly>
          <div className="buttonContainer">
            <HangupPhoneIcon hangup={this.props.hangup} />
            <span className="buttonSpan">Decline</span>
          </div>
          <div className="buttonContainer">
            <AnswerPhoneIcon answer={this.props.answer} />
            <span className="buttonSpan">Accept</span>
          </div>
        </FlexRowSpaceEvenly>
      </div>
    )
  }
}
