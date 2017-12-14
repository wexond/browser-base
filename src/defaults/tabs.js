export default {
  pinnedTabWidth: 32,
  maxTabWidth: 210,
  defaultOptions: {
    select: true,
    url: 'wexond://newtab'
  },
  transitions: {
    left: {
      duration: 0.3,
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    },
    width: {
      duration: 0.3,
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    },
    'background-color': {
      duration: 0.2,
      easing: 'ease-out'
    }
  }
}
