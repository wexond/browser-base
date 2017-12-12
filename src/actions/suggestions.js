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
          tempSuggestions.push({
            title: String(json[1][i]).toLowerCase(),
            type: 'search'
          })
        }
      }

      let newSuggestions = getSuggestions(tempSuggestions, 'title')
      // Get only first 5 suggestions.
      tempSuggestions = []
      for (var i = 0; i < 5; i++) {
        if (newSuggestions[i] != null) tempSuggestions.push(newSuggestions[i])
      }

      resolve(tempSuggestions)
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
    const regex = /(http(s?)):\/\/(www.)?/gi

    let tempSuggestions = []

    const filterSuggestions = (array, i, canSuggest) => {
      let url = array[i].url.toLowerCase()
      let title = array[i].title

      let suggestion = {
        title: title,
        url: url,
        canSuggest: canSuggest,
        type: 'history'
      }

      if (url.replace(regex, '').indexOf('/') === -1) {
        suggestion.canSuggest = true
      } else {
        if (url.replace(regex, '').split('/')[1] == null || url.replace(regex, '').split('/')[1].trim() === '') {
          suggestion.canSuggest = true
        }
      }

      if (url.indexOf(input) === -1) suggestion.canSuggest = false

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
      filterSuggestions(sites, i, true)
    }

    for (i = 0; i < history.length; i++) {
      filterSuggestions(history, i, false)
    }

    let suggestions = getSuggestions(tempSuggestions)
    let newSuggestions = []

    // Get only first 5 suggestions.
    tempSuggestions = []

    let suggestionsLimit = (!Network.isURL(input)) ? 5 : 10

    for (var i = 0; i < suggestionsLimit; i++) {
      if (suggestions[i] != null) tempSuggestions.push(suggestions[i])
    }
    newSuggestions = tempSuggestions.slice()
    suggestions = tempSuggestions.slice()

    // Remove the same suggestions.
    for (var x = 0; x < suggestions.length; x++) {
      for (var y = x + 1; y < suggestions.length; y++) {
        if (suggestions[x].url.replace(regex, '').replace('/', '') === suggestions[y].url.replace(regex, '').replace('/', '')) {
          newSuggestions.splice(newSuggestions.indexOf(suggestions[x]), 1)
        }
      }
    }

    let autocompleteSuggestions = 0

    for (var i = 0; i < newSuggestions.length; i++) {
      if (newSuggestions[i].canSuggest) {
        autocompleteSuggestions++
      }
    }

    newSuggestions.sort((a, b) => {
      let urlA = a.url.replace(regex, '').replace('/').length
      let urlB = b.url.replace(regex, '').replace('/').length
      return urlA - urlB
    })

    for (var i = 0; i < newSuggestions.length; i++) {
      if (newSuggestions[i].url.indexOf(input) !== -1 && newSuggestions[i].canSuggest) {
        let a = newSuggestions[0]
        let b = newSuggestions[i]
        newSuggestions[i] = a
        newSuggestions[0] = b

        newSuggestions[0].title = newSuggestions[0].url
        newSuggestions[0].url = null
        newSuggestions[0].description = 'open website'
        newSuggestions[0].type = 'first-url'

        break
      }
    }

    if (autocompleteSuggestions === 0) {
      if (Network.isURL(input)) {
        newSuggestions.unshift({
          title: (input.startsWith('http://')) ? input : 'http://' + input,
          description: 'open website',
          type: 'first-url'
        })
      } else {
        newSuggestions.unshift({
          title: input,
          description: 'search in Google',
          type: 'first-search'
        })
      }
    }

    resolve(newSuggestions)
  })
}

const getSuggestions = (suggestions, param = 'url') => {
  let tempSuggestions = suggestions.slice()
  suggestions = []
  // Remove duplicates from array.
  const seenSuggestions = []
  for (var i = 0; i < tempSuggestions.length; i++) {
    if (seenSuggestions.indexOf(tempSuggestions[i][param]) === -1) {
      suggestions.push(tempSuggestions[i])
      seenSuggestions.push(tempSuggestions[i][param])
    }
  }

  // Sort suggestions array by length.
  suggestions.sort((a, b) => { 
    return a[param].length - b[param].length
  })

  return suggestions
}