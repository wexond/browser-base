import { fsm } from 'typescript-state-machine'
import StateMachineImpl = fsm.StateMachineImpl
import State = fsm.State
import { Dispatcher } from './dispatcher'

enum CallStatesNames {
  IDLE = 'IDLE',
  OFF_HOOK = 'OFF_HOOK',
  INCOMING = 'INCOMING',
  ANSWERED = 'ANSWERED',
  CALL_OUT = 'CALL_OUT',
}

export class CallState extends State {
  label: CallStatesNames
}

export const IDLE_STATE = new CallState(CallStatesNames.IDLE)
export const OFF_HOOK_STATE = new CallState(CallStatesNames.OFF_HOOK)
export const INCOMING_STATE = new CallState(CallStatesNames.INCOMING)
export const ANSWERED_STATE = new CallState(CallStatesNames.ANSWERED)
export const CALL_OUT_STATE = new CallState(CallStatesNames.CALL_OUT)
const states = [IDLE_STATE, OFF_HOOK_STATE, INCOMING_STATE, ANSWERED_STATE, CALL_OUT_STATE]
const transitions = {
  [CallStatesNames.IDLE]: [OFF_HOOK_STATE, ANSWERED_STATE, INCOMING_STATE, CALL_OUT_STATE],
  [CallStatesNames.OFF_HOOK]: [INCOMING_STATE, CALL_OUT_STATE, IDLE_STATE],
  [CallStatesNames.INCOMING]: [ANSWERED_STATE, OFF_HOOK_STATE, IDLE_STATE],
  [CallStatesNames.ANSWERED]: [OFF_HOOK_STATE, IDLE_STATE],
  [CallStatesNames.CALL_OUT]: [OFF_HOOK_STATE, IDLE_STATE],
}

const STATUS_TO_STATE: {[key: string]: CallState} = {
  offhook: OFF_HOOK_STATE,
  incomming_call: INCOMING_STATE,
  answered: ANSWERED_STATE,
  callout: CALL_OUT_STATE,
}

export class CallStateMachine extends StateMachineImpl<CallState> {
  private _dispatcher: Dispatcher

  static getStateFromStatus(status: string) {
    return STATUS_TO_STATE[status]
  }

  constructor(dispatcher: Dispatcher) {
    super(states, transitions, IDLE_STATE)
    this._dispatcher = dispatcher
    this.onAnyTransition((from, to) => console.log(`Call transitioned from ${from.label} to ${to.label}`))
  }

  setState(state: CallState) {
    if (!this.inState(state)) {
      super.setState(state)
    }
  }

  terminate() {
    switch (this.state) {
      case INCOMING_STATE:
      case ANSWERED_STATE:
      case CALL_OUT_STATE:
        this._dispatcher.send('terminate')
        break
      case OFF_HOOK_STATE:
        // Nothing to do
        break
    }
  }

  call(callNumber: string) {
    this._dispatcher.send('call', { number: callNumber })
  }

  answer() {
    this._dispatcher.send('answer')
  }
}
