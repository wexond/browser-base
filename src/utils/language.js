export default class LanguageHelper {
  static capFirst (str) {
    return str[0].toUpperCase() + str.slice(1)
  }
}