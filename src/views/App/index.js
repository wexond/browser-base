'use strict'
import '../../app.scss'
import './global'

import Component from '../../classes/Component'
import UI from '../../classes/UI'

import Tabs from '../../components/Tabs'
import Bar from '../../components/Bar'
import ContextMenu from '../../components/ContextMenu'

class App extends Component {
  constructor() {
    super()
  }

  beforeRender() {
    window.app = this

    this.cursor = {}
  }

  render() {
    return (
      <div>
        <Tabs ref='tabs' />
        <Bar ref='bar' />
        <div className='pages' ref='pages' />
        <ContextMenu ref='webviewMenu' />
      </div>
    )
  }

  afterRender() {
    const self = this
    this.elements.tabs.addTab()

    window.addEventListener('mousedown', (e) => {
      self.elements.webviewMenu.hide()
    })

    this.elements.webviewMenu.updateItems(
      [
        {
          title: 'Open link in new tab',
          show: false,
          onClick: (e) => {
            let data = self.WCMData
            self.elements.tabs.addTab({select: false, url: data.linkURL})
          }
        },
        {
          title: 'Separator',
          show: false
        },
        {
          title: 'Copy link address',
          show: false,
          onClick: (e) => {
            let data = self.WCMData
            clipboard.clear()
            clipboard.writeText(data.linkURL)
          }
        },
        {
          title: 'Save link as',
          show: false,
          onClick: (e) => {
            let data = self.WCMData

            dialog.showSaveDialog(
              {
                defaultPath: 'link.html',
                filters: [
                  {
                    name: '*.html',
                    extensions: ['html']
                  }
                ]
              },
              function (path1) {
                var request = new XMLHttpRequest()
                request.open('GET', data.linkURL, true)
                request.send(null)
                request.onreadystatechange = function () {
                  if (request.readyState === 4) {
                    fs.writeFile(path1, request.responseText, (err) => {
                      if (err) console.error(err)
                    })
                  }
                }
              }
            )
          }
        },
        {
          title: 'Separator',
          show: false
        },
        {
          title: 'Open image in new tab',
          show: false,
          onClick: (e) => {
            let data = self.WCMData
            self.elements.tabs.addTab({select: false, url: data.srcURL})
          }
        },
        {
          title: 'Save image as',
          show: false,
          onClick: (e) => {
            let data = self.WCMData
            let name = path.basename(data.srcURL)
            let extension = path.extname(name)

            var request = require('request').defaults({ encoding: null })
            request.get(data.srcURL, function (err, res, body) {
                dialog.showSaveDialog(
                  {
                    defaultPath: 'image.' + extension,
                    filters: [
                      {
                        name: '',
                        extensions: [extension]
                      }
                    ]
                  },
                  function (path1) {
                    fs.writeFile(path1, body, (err) => {
                      if (err) console.error(err)
                    })
                  }
                )
            })
          }
        },
        {
          title: 'Copy image',
          show: false,
          onClick: (e) => {
            let data = self.WCMData
            clipboard.clear()
            let img = nativeImage.createFromDataURL(data.srcURL)
            clipboard.writeImage(img)
          }
        },
        {
          title: 'Copy image address',
          show: false,
          onClick: (e) => {
            let data = self.WCMData
            clipboard.clear()
            clipboard.writeText(data.srcURL)
          }
        },
        {
          title: 'Separator',
          show: false
        },
        {
          title: 'Print',
          show: false,
          onClick: (e) => {
            self.getSelectedPage().elements.webview.print()
          }
        },
        {
          title: 'Save as',
          show: false,
          onClick: (e) => {
            dialog.showSaveDialog(
              {
                defaultPath: self.getSelectedPage().elements.webview.getTitle() + '.html',
                filters: [
                  {
                    name: 'Webpage, complete',
                    extensions: ['html']
                  }
                ]
              },
              function (path1) {
                self.getSelectedPage().elements.webview.getWebContents().savePage(path1, 'HTMLComplete', (error) => {
                  if (error) console.error(error)
                })
              }
            )
          }
        },
        {
          title: 'Separator',
          show: false
        },
        {
          title: 'View source',
          show: false,
          onClick: (e) => {
            const url = self.getSelectedPage().elements.webview.getURL()
            self.elements.tabs.addTab({select: true, url: 'view-source:' + url})
          }
        },
        {
          title: 'Inspect element',
          onClick: (e) => {
            let data = self.WCMData
            self.getSelectedPage().elements.webview.inspectElement(data.x, data.y)
          }
        }
      ]
    )
  }

  getSelectedTab() {
    return this.elements.tabs.selectedTab
  }

  getSelectedPage() {
    return this.getSelectedTab().page
  }
}

// Wait for sass load.
setTimeout(function () {
  UI.render(<App />, document.getElementById('app'))
}, 1)
