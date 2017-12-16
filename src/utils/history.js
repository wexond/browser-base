import Language from '../defaults/language'

export default class History {
  // Separates history data in diffrent sections
  static parse (data) {
    const sections = []
    // Get sections
    for (var i = 0; i < data.length; i++) {
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
    // Change items order in sections
    // Now they are ordered from the oldest to the latest but
    // we want from the latest to the oldest
    for (var i = 0; i < sections.length; i++) {
      sections[i].items.reverse()
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
}