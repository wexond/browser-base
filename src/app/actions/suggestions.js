import Network from '../utils/network'
import * as storage from '../utils/storage'

import Store from '../stores/store'

export const getSearchSuggestions = async (text) => {
  return new Promise(async (resolve, reject) => {
    const input = text.trim().toLowerCase()
    
    if (input === '') { return resolve([]) }

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

      // Sort suggestions array by length.
      newSuggestions.sort((a, b) => { 
        return a.title.length - b.title.length
      })

      // Get only first 5 suggestions.
      tempSuggestions = []
      for (var i = 0; i < 5; i++) {
        if (newSuggestions[i] != null) { tempSuggestions.push(newSuggestions[i]) }
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

    if (input === '') { return resolve([]) }

    storage.history.all('SELECT * FROM history', (err, history) => {
      storage.favicons.all('SELECT * FROM favicons', (err, favicons) => {
        const regex = /(http(s?)):\/\/(www.)?/gi

        let tempSuggestions = []
        let validSuggestions = []
    
        const filterSuggestions = (array, i) => {
          let url = array[i].url.toLowerCase()
          let title = array[i].title
    
          let suggestion = {
            title: title,
            url: url,
            type: 'history',
            favicon: null
          }
    
          if (array[i].favicon != null) {
            for (var y = 0; y < favicons.length; y++) {
              if (favicons[y].url === array[i].favicon) {
                suggestion.favicon = favicons[y].favicon
              }
            }
          }
    
          const addSuggestion = (canSuggest) => {
            suggestion.canSuggest = canSuggest
            if (tempSuggestions.indexOf(suggestion) === -1) {
              if (canSuggest) {
                validSuggestions.splice(0, 0, suggestion)
              } else {
                tempSuggestions.push(suggestion)
              }
            }
          }
    
          const urlContainsInput = (isWWW) => {
            if (isWWW) {
              return url.replace(/(http(s?)):\/\//gi, '').startsWith(input.replace(/(http(s?)):\/\//gi, ''))
            } else {
              return url.replace(/(http(s?)):\/\/(www.)?/gi, '').startsWith(input.replace(/(http(s?)):\/\/(www.)?/gi, ''))
            }
          }
    
          const isMatch = (start) => {
            if (input.startsWith(start) && input.length > start.length) {
              if (input.startsWith(start + 'www.')) {
                if (input.length > (start + 'www.').length) {
                  if (urlContainsInput()) {
                    return true
                  }
                }
              } else {
                if (urlContainsInput()) {
                  return true
                }
              }
            }
            return false
          }
    
          if (isMatch('http://') 
              || isMatch('https://') 
              || (input.startsWith('www.') && input.length > 'www.'.length && urlContainsInput(true))
              || (!input.startsWith('http://') && !input.startsWith('https://') && !input.startsWith('www.') && urlContainsInput())) {
            addSuggestion(true)
          } else {
            if (title.toLowerCase().indexOf(input) !== -1 
                || (((input.startsWith('http://') || input.startsWith('https://')) && urlContainsInput())
                || (input.startsWith('www.')) && urlContainsInput(true))
                || url.indexOf(input) !== -1 
                || url.replace(/(http(s?)):\/\/(www.)?/gi, '').indexOf(input.replace(/(http(s?)):\/\/(www.)?/gi, '')) !== -1) {
              addSuggestion(false)
            }
          }
        }
    
        for (i = 0; i < history.length; i++) {
          filterSuggestions(history, i)
        }
    
        validSuggestions.sort((a, b) => {
          let urlA = a.url.replace(regex, '').replace('/').length
          let urlB = b.url.replace(regex, '').replace('/').length
          return urlA - urlB
        })
    
        // Sort suggestions array by length.
        tempSuggestions.sort((a, b) => { 
          return a.url.length - b.url.length
        })
    
        tempSuggestions = validSuggestions.concat(tempSuggestions)
    
        let suggestions = getSuggestions(tempSuggestions)
        let newSuggestions = []
    
        let isURL = false
    
        if (input.indexOf(' ') === -1) {
          if (input.replace('www.', '').indexOf('.') !== -1) {
            isURL = true
          } else {
            if ((input.startsWith('www.') && input.length > 'www.'.length)
                || (input.startsWith('https://') && input.length > 'https://'.length)
                || (input.startsWith('http://') && input.length > 'http://'.length)) {
              isURL = true
            }
          }
        }
    
        // Get only first 5 suggestions.
        tempSuggestions = []
    
        let suggestionsLimit = (isURL) ? 10 : 5
    
        for (var i = 0; i < suggestionsLimit; i++) {
          if (suggestions[i] != null) { tempSuggestions.push(suggestions[i]) }
        }
        
        newSuggestions = tempSuggestions.slice()
    
        newSuggestions.sort((a, b) => {
          let urlA = a.url.replace(regex, '').replace('/').length
          let urlB = b.url.replace(regex, '').replace('/').length
          return urlA - urlB
        })
    
        let isAutocomplete = false
    
        for (var i = 0; i < newSuggestions.length; i++) {
          if (newSuggestions[i].canSuggest) {
            let a = newSuggestions[0]
            let b = newSuggestions[i]
            newSuggestions[i] = a
            newSuggestions[0] = b
    
            newSuggestions[0].title = newSuggestions[0].url
            newSuggestions[0].url = null
            newSuggestions[0].description = Store.dictionary.suggestions.unknownURL
            newSuggestions[0].type = 'autocomplete-url'
    
            isAutocomplete = true
    
            break
          }
        }
    
        if (!isAutocomplete) {
          if (isURL) {
            newSuggestions.unshift({
              title: (input.startsWith('http://') || input.startsWith('https://')) ? input : 'http://' + input,
              description: Store.dictionary.suggestions.unknownURL,
              type: 'unknown-url'
            })
          } else {
            newSuggestions.unshift({
              title: input,
              description: Store.dictionary.suggestions.unknownSearch,
              type: 'unknown-search'
            })
          }
        }
    
        resolve(newSuggestions)
      })
    })
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

  return suggestions
}