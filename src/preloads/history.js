const fs = require('fs')
const paths = require('../defaults/files')

window.historyAPI = {
	get: () => {
		return new Promise((resolve, reject) => {
      fs.readFile(paths.files.history, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(JSON.parse(data))
        }
      })
    })
	}
}
