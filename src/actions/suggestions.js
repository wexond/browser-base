import Network from '../utils/network'
import Storage from '../utils/storage'

export const getSearchSuggestions = async (text) => {
  return new Promise(async (resolve, reject) => {
    const input = text.trim().toLowerCase()
    
    if (input === '') return resolve([])

    try {
      const data = await Network.requestURL('http://google.com/complete/search?client=chrome&q=' + text)
      const json = JSON.parse(data)

      let tempSuggestions = []
      const suggestions = []

      for (var i = 0; i < json[1].length; i++) {
        if (tempSuggestions.indexOf(json[1][i]) === -1) {
          tempSuggestions.push({url: String(json[1][i]).toLowerCase()})
        }
      }

      resolve(getSuggestions(tempSuggestions))
    } catch (e) {
      reject(e)
    }
  })
}

export const getHistorySuggestions = async (text) => {
  return new Promise(async (resolve, reject) => {
    const input = text.trim().toLowerCase()

    if (input === '') return resolve([])

    const history = await Storage.getHistory()
    let tempSuggestions = []
    const suggestions = []

    for (var i = 0; i < history.length; i++) {
      let url = history[i].url.toLowerCase()
      let title = history[i].title

      let suggestion = {
        title: title,
        url: url
      }

      // Adds suggestions to a list, only when
      // the url or the title contains input text.
      if (url.indexOf(input) !== -1 || title.toLowerCase().indexOf(input) !== -1) {
        if (tempSuggestions.indexOf(suggestion) === -1) {
          tempSuggestions.push(suggestion)
        }
      }
    }

    resolve(getSuggestions(tempSuggestions))
  })
}

const getSuggestions = (suggestions) => {
  let tempSuggestions = suggestions.slice()
  suggestions = []
  // Remove duplicates from array.
  const seenSuggestions = []
  for (i = 0; i < tempSuggestions.length; i++) {
    if (seenSuggestions.indexOf(tempSuggestions[i].url) === -1) {
      suggestions.push(tempSuggestions[i])
      seenSuggestions.push(tempSuggestions[i].url)
    }
  }

  // Sort suggestions array by length.
  suggestions.sort((a, b) => { 
    return a.url.length - b.url.length
  })

  // Get only first 5 suggestions.
  tempSuggestions = []
  for (var i = 0; i < 5; i++) {
    if (suggestions[i] != null) tempSuggestions.push(suggestions[i])
  }

  return tempSuggestions
}