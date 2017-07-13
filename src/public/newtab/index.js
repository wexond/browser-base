/**
 * On window load event.
 * Adds pages.
 * @param {Event}
 */
window.addEventListener('load', function (e) {
  const container = document.getElementById('container')

  for (var i = 0; i < 6; i++) {
    const page = new Page('https://www.google.com', 'Google', '')

    container.appendChild(page)
  }

  container.style.width = getContainerWidth(3) + 'px'
})

/**
 * Calculates container width.
 * @param {Int} items in one line
 * @param {Int} item width (optional)
 * @param {Int} item margin left (optional)
 * @return {Int} container width
 */
function getContainerWidth (count, itemWidth = 150, itemMarginLeft = 6) {
  return itemWidth * count + count * itemMarginLeft
}
