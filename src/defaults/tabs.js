export default {
  pinnedTabWidth: 32,
  maxTabWidth: 190,
  transitions: {
    left: {
      duration: 0.2,
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    },
    width: {
      duration: 0.2,
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    },
    'background-color': {
      duration: 0.2,
      easing: 'ease-out'
    }
  },
  defaultOptions: {
    select: true,
    url: 'wexond://newtab'
  }
}