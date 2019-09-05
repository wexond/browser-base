import { fsm } from 'typescript-state-machine'
import StateMachineImpl = fsm.StateMachineImpl
import State = fsm.State
import { RegisterProps } from '../views/phone'
import { Dispatcher } from './dispatcher'

enum RegisterStatesNames {
  IDLE = 'IDLE',
  CLIENT_NOT_RUNNING = 'CLIENT_NOT_RUNNING',
  UNREGISTERED = 'UNREGISTERED',
  REGISTERED = 'REGISTERED',
}

export class RegisterState extends State {
  constructor(readonly label: RegisterStatesNames, readonly parent?: State) {
    super(label, parent)
  }
}

export const IDLE_STATE = new RegisterState(RegisterStatesNames.IDLE)
export const CLIENT_NOT_RUNNING_STATE = new RegisterState(RegisterStatesNames.CLIENT_NOT_RUNNING)
export const UNREGISTERED_STATE = new RegisterState(RegisterStatesNames.UNREGISTERED)
export const REGISTERED_STATE = new RegisterState(RegisterStatesNames.REGISTERED)

const STATUS_TO_STATE: {[key: string]: RegisterState} = {
  'SIP client not running': CLIENT_NOT_RUNNING_STATE,
  unregistered: UNREGISTERED_STATE,
  registered: REGISTERED_STATE,
}

const CONNECTION_STATES = [
  IDLE_STATE,
  CLIENT_NOT_RUNNING_STATE,
  UNREGISTERED_STATE,
  REGISTERED_STATE,
]

const CONNECTION_TRANSITIONS = {
  [RegisterStatesNames.IDLE]: [CLIENT_NOT_RUNNING_STATE, REGISTERED_STATE, UNREGISTERED_STATE],
  [RegisterStatesNames.CLIENT_NOT_RUNNING]: [REGISTERED_STATE, UNREGISTERED_STATE, IDLE_STATE],
  [RegisterStatesNames.UNREGISTERED]: [REGISTERED_STATE, CLIENT_NOT_RUNNING_STATE, IDLE_STATE],
  [RegisterStatesNames.REGISTERED]: [UNREGISTERED_STATE, CLIENT_NOT_RUNNING_STATE, IDLE_STATE],
}

export class RegisterStateMachine extends StateMachineImpl<RegisterState> {
  private _dispatcher: Dispatcher
  private _registerProps: RegisterProps | null = null
  private _initTimeout: number | undefined
  private _registerTimeout: number | undefined

  static getStateFromStatus(status: string) {
    return STATUS_TO_STATE[status]
  }

  get registerProps() {
    return this._registerProps
  }

  set registerProps(props: RegisterProps | null) {
    const isDifferent = !this.registerProps || (props && (props.host !== this._registerProps!.host || props.username !== this._registerProps!.username))
    this._registerProps = props

    if (isDifferent && this.inState(REGISTERED_STATE)) {
      this.unregister()
    } else if (this.inState(UNREGISTERED_STATE)) {
      this.attemptToRegister()
    }
  }

  constructor(dispatcher: Dispatcher, registerProps: RegisterProps | null) {
    super(CONNECTION_STATES, CONNECTION_TRANSITIONS, IDLE_STATE)
    this.onEnterState(CLIENT_NOT_RUNNING_STATE, this.attemptToInit.bind(this))
    this.onLeaveState(CLIENT_NOT_RUNNING_STATE, this.clearInitAttemps.bind(this))
    this.onEnterState(UNREGISTERED_STATE, this.attemptToRegister.bind(this))
    this.onLeaveState(UNREGISTERED_STATE, this.clearRegisterAttempts.bind(this))
    this.onAnyTransition((from, to) => console.log(`Register transitioned from ${from.label} to ${to.label}`))

    this._dispatcher = dispatcher
    this.registerProps = registerProps
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
    this.send('init')
  }

  private attemptToRegister() {
    if (this._registerProps) {
      this.register()
      this._registerTimeout = setTimeout(this.attemptToRegister.bind(this), 5000)
    }
  }

  private clearRegisterAttempts() {
    if (this._registerTimeout) {
      clearTimeout(this._registerTimeout)
      this._registerTimeout = undefined
    }
  }

  private register() {
    if (this._registerProps) {
      this.send('register', this._registerProps)
    }
  }

  private unregister() {
    this.send('unregister')
  }
  private send(action: string, payload: {[key: string]: string} = {}) {
    this._dispatcher.send(action, payload)
  }

  setState(state: RegisterState) {
    if (!this.inState(state)) {
      super.setState(state)
    }
  }
}
