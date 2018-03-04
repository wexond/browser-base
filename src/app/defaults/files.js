const { homedir } = require('os')
const { join } = require('path')

module.exports = {
  directories: {
    wexond: join(homedir(), '.wexond'),
    userData: join(homedir(), '.wexond', 'user-data'),
    extensions: join(homedir(), '.wexond', 'user-data', 'extensions')
  },
  files: {
    history: join(homedir(), '.wexond', 'user-data', 'history.db'),
    sites: join(homedir(), '.wexond', 'user-data', 'sites.db'),
    bookmarks: join(homedir(), '.wexond', 'user-data', 'bookmarks.db'),
    favicons: join(homedir(), '.wexond', 'user-data', 'favicons.db'),
    settings: {
      path: join(homedir(), '.wexond', 'user-data', 'settings.json'),
      autoCreate: true,
      defaultContent: {
        adblock: true,
        adblockCosmetic: false,
        onStartup: {
          type: 0
        }
      }
    }
  }
}