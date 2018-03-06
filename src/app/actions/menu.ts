import Store from '../store'

export const getPosition = (menu) => {
  let left = Store.cursor.x + 1
  let top = Store.cursor.y + 1

  if (left + 300 > window.innerWidth) {
    left = Store.cursor.x - 301
  }
  if (top + menu.height > window.innerHeight) {
    top = Store.cursor.y - menu.height
  }
  if (top < 0) {
    top = 96
  }

  const position = {
    left: left,
    top: top
  }

  return position
}