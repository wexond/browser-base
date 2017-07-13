import Colors from './utils/colors'

export default class WebViewColors {
  static getColorFromTop (webview, callback = null) {
    if (webview != null && webview.getWebContents() != null) {
      webview.capturePage({
        x: 1,
        y: 1,
        width: 2,
        height: 2
      }, (image) => {
        var canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')
        var img = new Image()
        img.onload = () => {
          context.drawImage(img, 0, 0)
          var myData = context.getImageData(1, 1, 1, 1)
          if (myData != null) {
            var color = Colors.rgbToHex('rgb(' + myData.data[0] + ', ' + myData.data[1] + ', ' + myData.data[2] + ')')
            if (myData.data[3] === 0) {
              color = '#fff'
            }
            if (callback != null) {
              callback(color)
            }
          }
        }
        img.src = image.toDataURL()
        canvas.width = 2
        canvas.height = 2
      })
    }
  }

  static getColor (webview, callback = null) {
    if (webview != null && webview.getWebContents() != null) {
      // Checks if <meta name='theme-color' content='...'> tag exists.
      // When it exists, the tab's getting the color from content='...', otherwise it's getting color from top of a website.
      webview.executeJavaScript('(function () { return document.documentElement.innerHTML })()', false, function (result) {
        var regexp = /<meta name='?.theme-color'?.*>/
        if (!regexp.test(result)) {
          // Getting color from top of a website.
          if (callback != null) {
            WebViewColors.getColorFromTop(webview, (color) => {
              callback(color)
            })
          }
        }
      })
    }
  }
}
