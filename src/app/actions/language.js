import fs from 'fs'
import path from 'path'
import { remote } from 'electron'

import Store from '../store'

export const loadDictionary = (dname = 'english_US') => {
  try {
    const json = JSON.parse(fs.readFileSync(path.resolve(remote.getGlobal('shared').dirname, `dictionaries/${dname}.json`)))

    Store.dictionary = json
  } catch (e) {
    console.error(e)
  }
}