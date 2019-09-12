import { fsm } from 'typescript-state-machine'
import StateMachineImpl = fsm.StateMachineImpl
import State = fsm.State
import { Dispatcher } from './dispatcher'

enum CallStatesNames {
  IDLE = 'IDLE',
  CLIENT_NOT_RUNNING = 'CLIENT_NOT_RUNNING',
  OFF_HOOK = 'OFF_HOOK',
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
  ANSWERED = 'ANSWERED',
  CALL_OUT = 'CALL_OUT',
}

export class CallState extends State {
  label: CallStatesNames
}

export const IDLE_STATE = new CallState(CallStatesNames.IDLE)
export const CLIENT_NOT_RUNNING_STATE = new CallState(CallStatesNames.CLIENT_NOT_RUNNING)
export const OFF_HOOK_STATE = new CallState(CallStatesNames.OFF_HOOK)
export const INCOMING_STATE = new CallState(CallStatesNames.INCOMING)
export const OUTGOING_STATE = new CallState(CallStatesNames.OUTGOING)
export const ANSWERED_STATE = new CallState(CallStatesNames.ANSWERED)
export const CALL_OUT_STATE = new CallState(CallStatesNames.CALL_OUT)

const CALL_STATES = [
  IDLE_STATE,
  CLIENT_NOT_RUNNING_STATE,
  OFF_HOOK_STATE,
  INCOMING_STATE,
  OUTGOING_STATE,
  ANSWERED_STATE,
  CALL_OUT_STATE,
]

const transitions = {
  [CallStatesNames.IDLE]: [OFF_HOOK_STATE, ANSWERED_STATE, INCOMING_STATE, OUTGOING_STATE, CALL_OUT_STATE, CLIENT_NOT_RUNNING_STATE],
  [CallStatesNames.CLIENT_NOT_RUNNING]: [OFF_HOOK_STATE, IDLE_STATE],
  [CallStatesNames.OFF_HOOK]: [INCOMING_STATE, OUTGOING_STATE, IDLE_STATE, CLIENT_NOT_RUNNING_STATE],
  [CallStatesNames.INCOMING]: [ANSWERED_STATE, OFF_HOOK_STATE, IDLE_STATE, CLIENT_NOT_RUNNING_STATE],
  [CallStatesNames.OUTGOING]: [CALL_OUT_STATE, OFF_HOOK_STATE, IDLE_STATE, CLIENT_NOT_RUNNING_STATE],
  [CallStatesNames.ANSWERED]: [OFF_HOOK_STATE, IDLE_STATE, CLIENT_NOT_RUNNING_STATE],
  [CallStatesNames.CALL_OUT]: [OFF_HOOK_STATE, IDLE_STATE, CLIENT_NOT_RUNNING_STATE],
}

const STATUS_TO_STATE: {[key: string]: CallState} = {
  'SIP client not running': CLIENT_NOT_RUNNING_STATE,
  offhook: OFF_HOOK_STATE,
  incomming_call: INCOMING_STATE,
  answered: ANSWERED_STATE,
  callout: CALL_OUT_STATE,
}

export class CallStateMachine extends StateMachineImpl<CallState> {
  private _dispatcher: Dispatcher
  private _initTimeout: number | undefined
  private _outGoingCallTimeout: number | null = null
  _callingNumber: string = ''

  get callingNumber() {
    return this._callingNumber
  }

  set callingNumber(caller: string) {
    const splitCaller = caller.replace(/[><]/g, '').split(':')
    const numberAndServer = splitCaller[1]
    const callingNumber = numberAndServer ? numberAndServer.split('@')[0] : splitCaller[0] || ''
    this._callingNumber = callingNumber
  }

  static getStateFromStatus(status: string) {
    return STATUS_TO_STATE[status]
  }

  private attemptToInit() {
    this.init()
    this._initTimeout = setTimeout(this.attemptToInit.bind(this), 5000)
  }

  private clearInitAttemps() {
    if (this._initTimeout) {
      clearTimeout(this._initTimeout)
      this._initTimeout = undefined
    }
  }

  private init() {
    this._dispatcher.send('init')
  }

  constructor(dispatcher: Dispatcher) {
    super(CALL_STATES, transitions, IDLE_STATE)
    this._dispatcher = dispatcher

    this.onEnterState(CLIENT_NOT_RUNNING_STATE, this.attemptToInit.bind(this))
    this.onLeaveState(CLIENT_NOT_RUNNING_STATE, this.clearInitAttemps.bind(this))

    this.onAnyTransition(this.stateChanged.bind(this))
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
      case OUTGOING_STATE:
        this.setState(OFF_HOOK_STATE)
        break
      case OFF_HOOK_STATE:
        // Nothing to do
        break
    }
  }

  stateChanged(from: CallState, to: CallState) {
    console.log(`Call transitioned from ${from.label} to ${to.label}`)
    if (this._outGoingCallTimeout) {
      clearTimeout(this._outGoingCallTimeout)
      this._outGoingCallTimeout = null
    }
  }

  call(callNumber: string) {
    this._dispatcher.send('call', { number: callNumber })
    this._callingNumber = callNumber
    this.setState(OUTGOING_STATE)
    this._outGoingCallTimeout = setTimeout(() => this.setState(OFF_HOOK_STATE), 60000)
  }

  answer() {
    this._dispatcher.send('answer')
  }
}
