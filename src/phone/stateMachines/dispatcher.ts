import { fsm } from 'typescript-state-machine'
import StateMachineImpl = fsm.StateMachineImpl
import State = fsm.State
import CheckStateIs = fsm.CheckStateIs
import { CallStateMachine, CallState, OFF_HOOK_STATE, IDLE_STATE as CALL_IDLE_STATE } from './callStateMachine'
import { RegisterStateMachine, RegisterState, REGISTERED_STATE, UNREGISTERED_STATE, CLIENT_NOT_RUNNING_STATE, IDLE_STATE as REGISTER_IDLE_STATE } from './registerStateMachine'

enum ServerReference {
  SM01 = 'SM-01',
  SM02 = 'SM-02',
  SM03 = 'SM-03',
  SM04 = 'SM-04',
  SM05 = 'SM-05',
  SM06 = 'SM-06',
  SM07 = 'SM-07',
  SM08 = 'SM-08',
  SM09 = 'SM-09',
  SM10 = 'SM-10', // unregistered
  SM11 = 'SM-11',
  SM12 = 'SM-12',
  SM13 = 'SM-13',
  SM14 = 'SM-14',
  SM15 = 'SM-15',
  SM16 = 'SM-16',
  SM17 = 'SM-17',
  SM18 = 'SM-18',
  SM19 = 'SM-19',
  SM20 = 'SM-20',
}

interface ServerMessage {
  reference: ServerReference,
  refrence?: ServerReference,
  status?: string,
  message?: string
  action?: string,
  response?: string
  hook?: string,
  duration?: string,
  muted?: string,
  call_number?: string
  caller?: string
  from?: string
  to?: string
}

enum ConnectionStatesNames {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTED = 'CONNECTED',
}

export class ConnectionState extends State {
  constructor(readonly label: ConnectionStatesNames, readonly parent?: State) {
    super(label, parent)
  }
}

export const DISCONNECTED_STATE = new ConnectionState(ConnectionStatesNames.DISCONNECTED)
export const CONNECTED_STATE = new ConnectionState(ConnectionStatesNames.CONNECTED)

const CONNECTION_STATES = [
  DISCONNECTED_STATE,
  CONNECTED_STATE,
]

const CONNECTION_TRANSITIONS = {
  [ConnectionStatesNames.DISCONNECTED]: [CONNECTED_STATE],
  [ConnectionStatesNames.CONNECTED]: [DISCONNECTED_STATE],
}

export class Dispatcher extends StateMachineImpl<ConnectionState> {
  private _url: string
  private _websocket: WebSocket | undefined
  private _registerStateMachine: RegisterStateMachine | undefined
  private _callStateMachine: CallStateMachine | undefined
  private _connectionTimeout: number | undefined

  private updateStatuses() {
    this.updateStatus()
    this.updateRegisterStatus()
  }

  private updateStatus() {
    this.send('status')
  }

  private updateRegisterStatus() {
    this.send('status_register')
  }

  get url() {
    return this._url
  }

  set url(value: string) {
    const isDifferent = this._url !== value
    this._url = value

    if (this.inState(DISCONNECTED_STATE)) {
      this.connect()
    } else if (isDifferent) {
      this.disconnect()
    }
  }

  private set registerState(state: RegisterState) {
    if (this._registerStateMachine) {
      this._registerStateMachine.setState(state)
    }
  }

  private set callState(state: CallState) {
    if (this._callStateMachine) {
      this._callStateMachine.setState(state)
    }
  }

  constructor(phoneServer: string | null) {
    super(CONNECTION_STATES, CONNECTION_TRANSITIONS, DISCONNECTED_STATE)
    this.onEnterState(DISCONNECTED_STATE, this.connect.bind(this))
    this.onEnterState(CONNECTED_STATE, this.updateStatuses.bind(this))
    this.onAnyTransition((from, to) => console.log(`Connection transitioned from ${from.label} to ${to.label}`))

    this._url = phoneServer || 'ws://127.0.0.1:8001'
  }

  private onMessage(event: MessageEvent) {
    const message = JSON.parse(event.data) as ServerMessage
    const reference = message.reference || message.refrence

    switch (reference) {
      case ServerReference.SM01:
        this.setState(CONNECTED_STATE)
        break
      case ServerReference.SM02:
        this.callState = OFF_HOOK_STATE
        break
      case ServerReference.SM04:
        this.registerState = REGISTERED_STATE
        break
      case ServerReference.SM10:
      case ServerReference.SM11:
        this.registerState = UNREGISTERED_STATE
        break
      case ServerReference.SM12:
        this.registerState = CLIENT_NOT_RUNNING_STATE
        break
      case ServerReference.SM17:
        if (message.to) {
          this.statusChanged(message.to)
        }
        break
    }
  }

  private statusChanged(newStatus: string) {
    const callState = CallStateMachine.getStateFromStatus(newStatus)
    if (callState) {
      this.callState = callState
      return
    }
    const registerState = RegisterStateMachine.getStateFromStatus(newStatus)
    if (registerState) {
      this.registerState = registerState
      return
    }

    console.warn('No state found for status', newStatus)
  }

  private onError() {
    console.error('Connection error')
    console.log('Retrying in 5s')
    this._connectionTimeout = setTimeout(this.connect.bind(this), 5000)
  }

  private onClose() {
    this.setState(DISCONNECTED_STATE)
  }

  private connect() {
    if (this._connectionTimeout) {
      clearTimeout(this._connectionTimeout)
      this._connectionTimeout = undefined
    }
    this.disconnect()

    if (this._url) {
      this._websocket = new WebSocket(this._url)
      this._websocket.onerror = this.onError.bind(this)
      this._websocket.onopen = () => {
        if (this._websocket) {
          this._websocket.onclose = this.onClose.bind(this)
          this._websocket.onmessage = this.onMessage.bind(this)
        }
      }
    }
  }

  private disconnect() {
    this.callState = CALL_IDLE_STATE
    this.registerState = REGISTER_IDLE_STATE
    if (this._websocket) {
      if ([0, 1].includes(this._websocket.readyState)) {
        this._websocket.close()
      }
      delete this._websocket
    }
  }

  setup(registerStateMachine: RegisterStateMachine, callStateMachine: CallStateMachine) {
    this._registerStateMachine = registerStateMachine
    this._callStateMachine = callStateMachine
    this._registerStateMachine.onLeaveState(REGISTERED_STATE, this._callStateMachine.terminate.bind(this._callStateMachine))
    this.connect()
  }

  @CheckStateIs(CONNECTED_STATE, 'Cannot send message while disconnected')
  send(action: string, payload: {[key: string]: string} = {}) {
    if (this._websocket) {
      this._websocket.send(JSON.stringify({ action, ...payload }))
    }
  }
}
