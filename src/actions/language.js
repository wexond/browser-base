import Store from '../stores/store'

export const loadDictionary = (dname = 'english_US') => {
  try {
    const json = require(`../../resources/dictionaries/${dname}.json`)

    Store.dictionary = json
  } catch (e) {
    console.error(e)
  }
}