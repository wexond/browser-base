import Network from '../utils/network'
import Storage from '../utils/storage'

export const getSearchSuggestions = async (text) => {

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
      if ((url.indexOf(input) !== -1 && url.indexOf('?q=') === -1) 
          || title.toLowerCase().indexOf(input) !== -1) {
        if (tempSuggestions.indexOf(suggestion) === -1) {
          tempSuggestions.push(suggestion)
        }
      }
    }

    // Gets first suggestion.
    const shortestSuggestion = Object.assign({}, tempSuggestions[0])

    // Gets shortest suggestion. 
    // For example when we have:
    // `https://google.com/?q=something`
    // it takes `https://google.com` from it
    if (shortestSuggestion != null && shortestSuggestion.url != null) {
      // Removes `http://`, `www.`, `/` etc.
      let url = shortestSuggestion.url
      url = url.substring(0, url.indexOf('/'))

      shortestSuggestion.url = url

      // Add the suggestion to the first position.
      if (url.startsWith(input)) {
        tempSuggestions.unshift(shortestSuggestion)
      }
    }
    
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
    for (i = 0; i < 5; i++) {
      if (suggestions[i] != null) tempSuggestions.push(suggestions[i])
    }
    
    resolve(tempSuggestions)
  })
}