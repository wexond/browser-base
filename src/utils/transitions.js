export default class Transitions {
  /**
   * Converts transitions string to array of transitions.
   * @param {String} transitions
   * @return {Array}
   */
  static getTransitions (transitions) {
    var final = transitions.replace(/,(?=((?!\().)*?\))/g, ';')

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
   * @param {String} transitions - current transitions
   * @param {String} transition - transition to add
   */
  static appendTransition (transitions, transition) {
    transitions = Transitions.getTransitions(transitions)

    transitions.push(transition)

    return transitions.join(', ')
  }

  /**
   * Removes transition from string.
   * @param {String} transitions - current transitions
   * @param {String} transition - transition to add
   */
  static removeTransition (transitions, transition) {
    transitions = Transitions.getTransitions(transitions)

    transitions.splice(transitions.indexOf(transition), 1)

    return transitions.join(', ')
  }
}
