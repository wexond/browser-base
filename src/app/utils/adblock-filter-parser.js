module.exports = {
  parse: (text) => {
    text = text.replace(/^\uFEFF/, '');
    const lines = text.split('\n')

    const blacklist = []
    const whitelist = []

    for (var i in lines) {
      if (lines[i].startsWith('@@')) {
        whitelist.push(lines[i])
      } else if (!lines[i].startsWith('!') && !lines[i].startsWith('[')) {
        blacklist.push(lines[i])
      }
    }

    return blacklist
  },
  isAd: (url, blacklist) => {
    return isMatch(url, blacklist)
  }
}

const isMatch = (url, list) => {
  for (var x in list) {
    if (list[x].startsWith('||')) {
      const urlParts = url.split('/')
      urlParts.splice(0, 2)

      if (urlParts[urlParts.length - 1] === '') urlParts.splice(urlParts.length - 1, 1)

      let domain = urlParts[0].split(':')[0]

      const domainFilter = list[x].replace('||', '').replace('^', '').replace('\r', '')

      if (domainFilter.split('/').length === urlParts.length) {
        domain = ''
        for (var i in urlParts) {
          domain += urlParts[i]

          if (Number(i) !== urlParts.length - 1) domain += '/'
        }
        domain = domain.split(':')[0]
      }

      if (domain.endsWith(domainFilter)) return true

      return false
    } else if (list[x].startsWith('|')) {
      if (list[x].replace('|', '') === url) return true
      return false
    } else {
      const addressParts = list[x].split('*')
      const urlParts = url.split('/')
  
      if (url.indexOf(addressParts[0]) !== -1) {
        const tempUrl = url.substr(url.indexOf(addressParts[0]))
        const tempUrlParts = tempUrl.split('/')
  
        let isMatching = true
  
        let offset = 0
  
        for (var y = 0; y < Math.floor(addressParts.length / 2); y++) {
          const a = addressParts[y].replace('^', '').trim()
          const b = addressParts[y + 1].replace('^', '').trim()
          const regex = new RegExp(escapeRegExp(a) + '(.*)' + escapeRegExp(b))
          const match = tempUrl.match(regex)
          if (match == null || match[1] == null) {
            isMatching = false
            break
          } else {
            offset += match[1].length - 1
          }
        }
  
        if (isMatching) {
          for (var y = 0; y < list[x].length; y++) {
            if (list[x][y] === '^') {
              if (tempUrl[y + offset] !== '/' && tempUrl[y + offset] !== '?' && tempUrl[y + offset] != null) {
                isMatching = false
                break
              }
            }
          }
        }
  
        return isMatching
      }
    }
  }
  return false
}

const escapeRegExp = (str) => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}