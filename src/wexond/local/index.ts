const en = require('./en/message.json')
const fr = require('./fr/message.json')
debugger
export type LocalisedMessage = {[key: string]: {message: string}} | undefined
export const local: { [key: string]: LocalisedMessage } = {
  en,
  fr,
}
