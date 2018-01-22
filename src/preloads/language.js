if (window.location.protocol === 'wexond:') {
  window.env = process.env.NODE_ENV

  window.dictionaryAPI = {
    get: (dname) => {
      try {
        const json = require(`../../resources/dictionaries/${dname}.json`)
    
        return json
      } catch (e) {
        console.error(e)
      }
    }
  }
}