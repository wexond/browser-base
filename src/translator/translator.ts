import { LocalisedMessage } from '~/local'

export class Translator {
  private _currentLang?: string
  keys: { [key: string]: LocalisedMessage } = {}

  set currentLang(lang: string) {
    this._currentLang = lang
  }

  addKeys(lang: string, keys: LocalisedMessage) {
    const previousKeys = this.keys[lang] || {}

    for (const key in keys) {
      if (!!previousKeys[key]) {
        console.warn(`Warning: key ${key} (value ${previousKeys[key].message}) will be overrided with value ${keys[key].message}`)
      }
    }

    this.keys[lang] = Object.assign({}, previousKeys, keys)
  }

  translate(text: string, lang: string = this._currentLang) {
    const localisedMessage = this.keys[lang]

    if (localisedMessage && localisedMessage[text]) {
      return localisedMessage[text].message
    }

    return text
  }
}
