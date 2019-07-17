import * as moment from 'moment';
import { local } from '~/local'
const defaultLanguage = 'en'

export function translate(text: string) {
  const localisedMessage = local[getUILanguage()]
  if (localisedMessage && localisedMessage[text]) {
    return localisedMessage[text].message
  }
  return text
}
const param = new URLSearchParams(location.search);
let UILanguage = defaultLanguage;
if (param.has('lang')) {
  UILanguage = param.get('lang') || defaultLanguage
}
moment.locale(UILanguage)

export function getUILanguage() {
  return UILanguage
}
