const fs = require('fs')
const path = require('path')

if (window.location.protocol === 'wexond:') {
  window.env = process.env.NODE_ENV

  window.dictionaryAPI = {
    get: (dname = 'english_US') => {
      try {
        const json = JSON.parse(fs.readFileSync(path.resolve(process.env.dirname, `dictionaries/${dname}.json`)))
    
        return json
      } catch (e) {
        console.error(e)
      }
    }
  }
}
