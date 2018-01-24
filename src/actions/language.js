import fs from 'fs'
import path from 'path'

import Store from '../stores/store'

export const loadDictionary = (dname = 'english_US') => {
  try {
    const json = JSON.parse(fs.readFileSync(path.resolve(process.env.dirname, `dictionaries/${dname}.json`)))

    Store.dictionary = json
  } catch (e) {
    console.error(e)
  }
}