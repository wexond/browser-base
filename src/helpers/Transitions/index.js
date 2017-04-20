export default class Transitions {
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

  static appendTransition (str, transition) {
    let transitions = Transitions.getTransitions(str)

    transitions.push(transition)

    return transitions.join(', ')
  }

  static removeTransition (str, transition) {
    let transitions = Transitions.getTransitions(str)

    transitions.splice(transitions.indexOf(transition), 1)

    return transitions.join(', ')
  }
}
