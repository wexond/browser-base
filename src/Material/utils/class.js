export default class ClassManager {
  static get (main, additional) {
    if (additional == null) {
      return main
    } else {
      let classes = main

      for (var i = 0; i < additional.length; i++) {
        if (additional[i] != null && additional[i].length !== 0) {
          classes += ' ' + additional[i]
        }
      }

      return classes
    }
  }
}