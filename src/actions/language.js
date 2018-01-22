import LanguageStore from '../stores/language'

export const loadDictionary = (dname) => {
  try {
    const json = require(`../../resources/dictionaries/${dname}.json`)

    LanguageStore.dictionary = json
  } catch (e) {
    console.error(e)
  }
}