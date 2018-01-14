const fs = require('fs')
const path = require('path')

const list = fs.readFileSync(path.resolve(__dirname, '../../adblock/adblock-cosmetic.dat'), 'utf8')
const filters = list.split('\n')

let blockedSelectors = []

let changedNodes = []
let timeout = null

const toDivide = 2048

for (var x = filters.length - 1; x >= 0; x--) {
  if (filters[x].split('##')[1] != null) {
    if (filters[x].split('##')[0] === '') {
      if (blockedSelectors.indexOf(filters[x].split('##')[1]) === -1) {
        blockedSelectors.push(filters[x].split('##')[1])
      }
    } else {
      const domains = filters[x].split('##')[0].split(',')

      let canPush = false

      for (var y = 0; y < domains.length; y++) {
        if (window.location.href.split('/')[2].trim().toLowerCase().endsWith(domains[y].trim().toLowerCase())) {
          canPush = true
        } else {
          if (domains[y].trim().toLowerCase().startsWith('~')) {
            if (window.location.href.split('/')[2].trim().toLowerCase().endsWith(domains[y].trim().toLowerCase().split('~')[1])) {
              canPush = false
              break
            }
          }
        }
      }
      if (canPush && blockedSelectors.indexOf(filters[x].split('##')[1]) === -1) {
        blockedSelectors.push(filters[x].split('##')[1])
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  observer.observe(
    document.body,
    {
      attributes: true,
      childList: true
    }
  )
})

const observer = new MutationObserver((mutations) => {
  for (let i = changedNodes.length - 1; i >= 0; i--) {
    if (!document.contains(changedNodes[i])) changedNodes.splice(i, 1)
  }

  for (let mutation of mutations) {
    let node = mutation.target

    if (!document.contains(node)) continue

    if (mutation.type == "attributes") node = node.parentNode

    let addNode = true
    for (let i = changedNodes.length - 1; i >= 0; i--) {
      let previouslyChangedNode = changedNodes[i]
      if (previouslyChangedNode.contains(node)) {
        addNode = false
        break
      }

      if (node.contains(previouslyChangedNode)) changedNodes.splice(i, 1)
    }

    if (addNode) changedNodes.push(node)
  }

  setTimeout(() => {
    for (let x = toDivide - 1; x >= 0; x--) {
      setTimeout(() => {
        var i
        for (i = Math.floor((blockedSelectors.length / toDivide) * (x + 1)) - 1; i >= Math.floor((blockedSelectors.length / toDivide) * (x)); i--) {
          var z
          for (z = changedNodes.length - 1; z >= 0; z--) {
            const elements = changedNodes[z].querySelectorAll(blockedSelectors[i])
            var y
            for (y = elements.length - 1; y >= 0; y--) {
              elements[y].style.display = 'none'
            }
          }
        }
      })
    }
  }, 1000)
})