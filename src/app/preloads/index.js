require('./history.js')
const settingsAPI = require('./settings.js')

settingsAPI.get().then((settings) => {
  if (settings.adblockCosmetic) {
    require('./ad-block.js')
  }
})


require('./language.js')
