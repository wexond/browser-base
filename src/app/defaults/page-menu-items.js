import * as actions from '../actions/page-menu'

import Store from '../stores/store'

export default () => {
  const {
    openLinkInNewTab,
    copyLinkAddress,
    saveLinkAs,
    openImageInNewTab,
    saveImageAs,
    copyImage,
    copyImageAddress,
    print,
    saveAs,
    viewSource,
    inspectElement
  } = Store.dictionary.menu.page

  return [
    {
      title: openLinkInNewTab,
      visible: false,
      onClick: actions.openLinkInNewTab
    },
    {
      type: 'separator',
      visible: false
    },
    {
      title: copyLinkAddress,
      visible: false,
      onClick: actions.copyLinkAddress
    },
    {
      title: saveLinkAs,
      visible: false,
      onClick: actions.saveLinkAs
    },
    {
      type: 'separator',
      visible: false
    },
    {
      title: openImageInNewTab,
      visible: false,
      onClick: actions.openImageInNewTab
    },
    {
      title: saveImageAs,
      visible: false,
      onClick: actions.saveImageAs
    },
    {
      title: copyImage,
      visible: false,
      onClick: actions.copyImage
    },
    {
      title: copyImageAddress,
      visible: false,
      onClick: actions.copyImageAddress
    },
    {
      type: 'separator',
      visible: false
    },
    {
      title: print,
      visible: false,
      onClick: actions.print
    },
    {
      title: saveAs,
      visible: false,
      onClick: actions.saveAs
    },
    {
      type: 'separator',
      visible: false
    },
    {
      title: viewSource,
      visible: false,
      onClick: actions.viewSource
    },
    {
      title: inspectElement,
      onClick: actions.inspectElement
    }
  ]
}