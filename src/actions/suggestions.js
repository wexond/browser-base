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

    const sites = await Storage.getSites()
    const history = await Storage.getHistory()
    let tempSuggestions = []

    const filterSuggestions = (array, i) => {
      let url = array[i].url.toLowerCase()
      let title = array[i].title

      let suggestion = {
        title: title,
        url: url
      }

      // Adds suggestions to a list, only when
      // the url or the title contains input text.
      if (url.replace(/(http(s?)):\/\/(www.)?/gi, '').startsWith(input)
          || url.startsWith(input)
          || url.replace(/(http(s?)):\/\/?/gi , '').startsWith(input)
          || url.replace(/(www.)?/gi, '').startsWith(input)
          || title.toLowerCase().indexOf(input) !== -1
          || url.replace(/(http(s?)):\/\/(www.)?/gi, '').startsWith(input.replace(/(http(s?)):\/\/(www.)?/gi, ''))
          || url.replace(/(http(s?)):\/\/?/gi, '').startsWith(input.replace(/(www.)?/gi, ''))) {
        if (tempSuggestions.indexOf(suggestion) === -1) {
          tempSuggestions.push(suggestion)
        }
      }
    }

    for (var i = 0; i < sites.length; i++) {
      filterSuggestions(sites, i)
    }

    for (i = 0; i < history.length; i++) {
      filterSuggestions(history, i)
    }

    let regex = /(http(s?)):\/\/(www.)?/gi
    let suggestions = getSuggestions(tempSuggestions)
    let newSuggestions = suggestions.slice()

    // Remove the same suggestions.
    for (var x = 0; x < suggestions.length; x++) {
      for (var y = x + 1; y < suggestions.length; y++) {
        if (suggestions[x].url.replace(regex, '') === suggestions[y].url.replace(regex, '')) {
          newSuggestions.splice(newSuggestions.indexOf(suggestions[x]), 1)
        }
      }
    }

    resolve(newSuggestions)
  })
}

const getSuggestions = (suggestions) => {
  let tempSuggestions = suggestions.slice()
  suggestions = []
  // Remove duplicates from array.
  const seenSuggestions = []
  for (var i = 0; i < tempSuggestions.length; i++) {
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