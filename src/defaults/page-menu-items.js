import * as actions from '../actions/page-menu'

export default [
  {
    title: 'Open link in new tab',
    visible: false,
    onClick: actions.openLinkInNewTab
  },
  {
    type: 'separator',
    visible: false
  },
  {
    title: 'Copy link address',
    visible: false,
    onClick: actions.copyLinkAddress
  },
  {
    title: 'Save link as',
    visible: false,
    onClick: actions.saveLinkAs
  },
  {
    type: 'separator',
    visible: false
  },
  {
    title: 'Open image in new tab',
    visible: false,
    onClick: actions.openImageInNewTab
  },
  {
    title: 'Save image as',
    visible: false,
    onClick: actions.saveImageAs
  },
  {
    title: 'Copy image',
    visible: false,
    onClick: actions.copyImage
  },
  {
    title: 'Copy image address',
    visible: false,
    onClick: actions.copyImageAddress
  },
  {
    type: 'separator',
    visible: false
  },
  {
    title: 'Print',
    visible: false,
    onClick: actions.print
  },
  {
    title: 'Save as',
    visible: false,
    onClick: actions.saveAs
  },
  {
    type: 'separator',
    visible: false
  },
  {
    title: 'View source',
    visible: false,
    onClick: actions.viewSource
  },
  {
    title: 'Inspect element',
    onClick: actions.inspectElement
  }
]