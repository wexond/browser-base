const { homedir } = require('os')
const { join } = require('path')

export const paths = {
  directories: {
    wexond: join(homedir(), '.wexond'),
    userData: join(homedir(), '.wexond', 'userData'),
    extensions: join(homedir(), '.wexond', 'userData', 'extensions')
  },
  files: {
    history: join(homedir(), '.wexond', 'userData', 'history.json'),
    bookmarks: join(homedir(), '.wexond', 'userData', 'bookmarks.json')
  }
}