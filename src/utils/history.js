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
          items: []
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
      prefix = window.dictionary.timeAndDate.today
    } else if (sectionDateString === yesterdayDate.toDateString()) {
      prefix = window.dictionary.timeAndDate.yesterday
    }
    // Get name of day in week
    const nameOfDay = window.dictionary.timeAndDate.weekDays[sectionDate.getDay()]
    // Get name of month
    const month = window.dictionary.timeAndDate.months[sectionDate.getMonth()]
    // Create full date. For example saturday, 16 december 2017
    const fullDate = `${nameOfDay}, ${sectionDate.getDate()} ${month} ${sectionDate.getFullYear()}`
    // Final date
    return `${prefix ? (prefix + ' - ') : ''}${fullDate}`
  }

  static getDomain (url) {
    // Get domain by getting second value of split url by slash
    return url.split('/')[2]
  }

  static getWebSiteIndex (data, url) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].domain.replace('/', '').toLowerCase().replace('https://', 'http://') == url.replace('/', '').toLowerCase().replace('https://', 'http://')) return i
    }

    return -1
  }

    /**
   * Gets the most visited websites
   */
  static getCards (history, fullInfoCardsCount = 3, cardsCount = 6) {
    const cards = {fullInfo: [], lessInfo: []}
    const websites = []
    // Get websites
    for (var i = 0; i < history.length; i++) {
      const item = history[i]
      const domain = History.getDomain(item.url)

      const index = History.getWebSiteIndex(websites, domain)
      
      if (index === -1) {
        websites.push(Object.assign(item, {domain: domain, count: 1}))
      } else {
        websites[index].count += 1
      }
    }
    // Sort websites by visited count
    websites.sort((a, b) => {
      return b.count - a.count;
    })
    // Select the most visited websites
    for (var i = 0; i <= cardsCount; i++) {
      if (i >= websites.length) {
        break
      } else {
        const ogData = websites[i].ogdata
        // If website has og data (image and description) then add the website to full info cards
        if (ogData != null && ogData.description != null && ogData.image != null && ogData.image.startsWith('http') && cards.fullInfo.length <= fullInfoCardsCount) {
          cards.fullInfo.push(websites[i])
        } else {
          cards.lessInfo.push(websites[i])
        }
      }
    }
    // Complete less info cards with more cards if needed
    if (cards.lessInfo.length < 6) {
      const actualIndex = cards.lessInfo.length + cards.fullInfo.length

      for (var i = actualIndex; i <= actualIndex + cardsCount - cards.lessInfo.length; i++) {
        if (i >= websites.length) break
        else cards.lessInfo.push(websites[i])
      }
    }

    return cards
  }
}