import Language from '../defaults/language'

export default class History {
  // Separates history data in diffrent sections
  static getSections (data) {
    const sections = []
    // Get sections
    for (var i = data.length - 1; i >= 0; i--) {
      const item = data[i]
      // Get section index
      let sectionIndex = History.getSectionIndexByDate(sections, item.date)
      // If section doesn't exists then create new
      if (sectionIndex === -1) {
        sections.push({
          title: History.getSectionTitle(item.date),
          date: item.date,
          items: [],
        })
        // Update section index
        sectionIndex = sections.length - 1
      }
      // Add domain to item
      item.domain = History.getDomain(item.url)
      // Add item to section
      sections[sectionIndex].items.push(item)
    }

    return sections
  }

  static getSectionIndexByDate (sections, date) {
    // Search in sections for given date
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].date === date) return i
    }

    return -1
  }

  static getSectionTitle (date) {
    // Parse string into data object
    const sectionDate = new Date(date)
    // Parse section date into string. For example into Sat Dec 16 2017
    const sectionDateString = sectionDate.toDateString()
    // Get today's date
    const actualDate = new Date()
    // Get yesterday's date by parsing today's date into milliseconds since 1970
    // and subtraction from this 24 hours converted into milliseconds
    const yesterdayDate = new Date(actualDate.getTime() - (24 * 3600000))
    // Title prefix. For example title is like Today - 16.12.2017
    let prefix = false
    // If section date string equals today's date string then
    // prefix is "Today"
    if (sectionDateString === actualDate.toDateString()) {
      prefix = 'Today'
    } else if (sectionDateString === yesterdayDate.toDateString()) {
      prefix = 'Yesterday'
    }
    // Get name of day in week
    const nameOfDay = Language.english.weekDays[sectionDate.getDay()]
    // Get name of month
    const month = Language.english.months[sectionDate.getMonth()]
    // Create full date. For example saturday, 16 december 2017
    const fullDate = `${nameOfDay}, ${sectionDate.getDate()} ${month} ${sectionDate.getFullYear()}`
    // Final date
    return `${prefix ? (prefix + ' - ') : ''}${fullDate}`
  }

  static getDomain (url) {
    // Get domain by getting second value of split url by slash
    return url.split('/')[2]
  }

  /**
   * Gets the most visited websites
   */
  static getCards (history, count = 9) {
    const webSites = []

    for (var i = 0; i < history.length; i++) {
      const item = history[i]
      const domain = History.getDomain(item.url)

      let index = History.getWebSiteIndex(webSites, domain)

      if (index === -1) {
        webSites.push({
          url: domain,
          title: history[i].title,
          favicon: history[i].favicon,
          description: '',
          count: 1
        })
      } else {
        webSites[index].count = webSites[index].count + 1
      }
    }
    // Sort web sites by visits count
    webSites.sort((a, b) => {
      return b.count - a.count;
    })

    const cards = []

    for (var i = 0; i < count; i++) {
      if (i >= webSites.length) {
        break
      } else {
        cards.push(webSites[i])
      }
    }

    return cards
  }

  static getWebSiteIndex (data, url) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].url.replace('/', '').toLowerCase().replace('https://', 'http://') == url.replace('/', '').toLowerCase().replace('https://', 'http://')) return i
    }

    return -1
  }
}