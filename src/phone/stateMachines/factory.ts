import { RegisterProps } from '../views/phone'
import { Dispatcher } from './dispatcher'
import { RegisterStateMachine } from './registerStateMachine'
import { CallStateMachine } from './callStateMachine'

export class PhoneStateMachine {
  static factory(phoneServer: string | null, registerProps: RegisterProps | null) {
    const dispatcher = new Dispatcher(phoneServer)
    const registerStateMachine = new RegisterStateMachine(dispatcher, registerProps)
    const callStateMachine = new CallStateMachine(dispatcher)
    dispatcher.setup(registerStateMachine, callStateMachine)
    return { registerStateMachine, callStateMachine }
  }
}
