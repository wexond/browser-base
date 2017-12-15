const { homedir } = require('os')
const { join } = require('path')

module.exports = {
  directories: {
    wexond: join(homedir(), '.wexond'),
    userData: join(homedir(), '.wexond', 'user-data'),
    extensions: join(homedir(), '.wexond', 'user-data', 'extensions')
  },
  files: {
    history: join(homedir(), '.wexond', 'user-data', 'history.json'),
    sites: join(homedir(), '.wexond', 'user-data', 'sites.json'),
    bookmarks: join(homedir(), '.wexond', 'user-data', 'bookmarks.json'),
    favicons: join(homedir(), '.wexond', 'user-data', 'favicons.json')
  }
}