const fs = require('fs')
const path = require('path')
const { remote } = require('electron')

if (window.location.protocol === 'wexond:') {
  window.env = process.env.NODE_ENV

  window.dictionaryAPI = {
    get: (dname = 'english_US') => {
      try {
        const json = JSON.parse(fs.readFileSync(path.resolve(remote.getGlobal('shared').dirname, `dictionaries/${dname}.json`)))
    
        return json
      } catch (e) {
        console.error(e)
      }
    }
  }
}
