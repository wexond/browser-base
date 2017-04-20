export default class Transitions {
  /**
   * Converts transitions string to array of transitions.
   * @param {string} str
   * @return {array}
   */
  static getTransitions (str) {
    var final = str.replace(/,(?=((?!\().)*?\))/g, ';')

    let arr = final.split(',').map(function (item) {
      if (item.trim() !== '') {
        return item.trim()
      }
    })

    arr = arr.filter(function (element) {
      return element !== undefined
    })

    arr = arr.map(function (item) {
      return item.replace(/;/g, ',')
    })

    return arr
  }

  /**
   * Appends transition to string.
   * @param {string} str - current transitions
   * @param {string} transition - transition to add
   */
  static appendTransition (str, transition) {
    let transitions = Transitions.getTransitions(str)

    transitions.push(transition)

    return transitions.join(', ')
  }

  /**
   * Removes transition from string.
   * @param {string} str - current transitions
   * @param {string} transition - transition to add
   */
  static removeTransition (str, transition) {
    let transitions = Transitions.getTransitions(str)

    transitions.splice(transitions.indexOf(transition), 1)

    return transitions.join(', ')
  }
}
