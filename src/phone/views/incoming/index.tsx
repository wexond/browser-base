import * as React from 'react'
import { FlexRowSpaceEvenly } from '../flex'
import { AnswerPhoneIcon, HangupPhoneIcon } from '../phoneButtons'
import './Incoming.css'
import { RemoteCodes } from '../../remote'

interface IncomingProps {
  answer: () => void
  hangup: () => void
}

export class Incoming extends React.Component<IncomingProps> {
  private onKeyDown(e: KeyboardEvent) {
    if (e.keyCode === 13 || e.code === RemoteCodes.ANSWER_KEY || e.code === RemoteCodes.ANSWER_GESTURE) {
      this.props.answer()
    } else if (e.code === RemoteCodes.HANGUP_KEY || e.code === RemoteCodes.HANGUP_GESTURE) {
      this.props.hangup()
    }
  }

  constructor(props: IncomingProps) {
    super(props)
    this.onKeyDown = this.onKeyDown.bind(this)
  }
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

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
  }
}
