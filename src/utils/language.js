export default class LanguageHelper {
  static capFirst (str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase()
  }

  static completeWithEndings (obj, value) {
    if (typeof obj === 'object') {
      const conditions = Object.keys(obj)

      for (var i = 0; conditions.length; i++) {
        if (conditions[i] == null) break
        const conditionChar = conditions[i][0]
        const integer = parseInt(conditions[i].slice(1))
        
        if (conditionChar == '<' && value < integer || conditionChar == '>' && value > integer) {
          return obj[conditions[i]]
        }
      }
    } else {
      return obj
    }
  }
}
