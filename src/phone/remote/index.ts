/**
 * Events triggered by the remote
 * Values are assigned to the property "code" of the event
 */
export enum RemoteCodes {
  ANSWER_KEY = 'F14',
  ANSWER_GESTURE = 'F23',
  HANGUP_KEY = 'F15',
  HANGUP_GESTURE = 'F24',
  MUTE = 'F21',
  VOL_UP = 'F20',
  VOL_DOWN = 'F19',
  CHANNEL_UP = 'F18',
  CHANNEL_DOWN = 'F17',
  HASH = 'F13',
  TIMES = 'NumpadMultiply',
  MENU = 'F22',
  BACK = 'Escape',
}
