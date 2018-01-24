import fs from 'fs'

import Store from '../stores/store'

export const loadDictionary = (dname = 'english_US') => {
  try {
    const json = JSON.parse(fs.readFileSync(`./dictionaries/${dname}.json`))

    Store.dictionary = json
  } catch (e) {
    console.error(e)
  }
}