import Colors from '../utils/colors'

export const getBarBorder = (webview) => {
  return new Promise((resolve, reject) => {
    if (webview != null && webview.getWebContents() != null) {
      webview.executeJavaScript('(function () { return document.documentElement.innerHTML })()', false, async (result) => {
        const regexp = /<meta name='?.bar-border'?.* content='?.false'?.*>/
        resolve(!regexp.test(result))
      })
    } else {
      reject(new Error('WebContents are not available'))
    }
  })
}

export const getColorFromTop = (webview) => {
  return new Promise((resolve, reject) => {
    if (webview != null && webview.getWebContents() != null) {
      webview.capturePage({
        x: 1,
        y: 1,
        width: 2,
        height: 2
      }, (image) => {
        let canvas = document.createElement('canvas')
        let context = canvas.getContext('2d')
        let img = new Image()
  
        img.onload = () => {
          context.drawImage(img, 0, 0)
          let myData = context.getImageData(1, 1, 1, 1)
  
          if (myData != null) {
            let color = Colors.rgbToHex('rgb(' + myData.data[0] + ', ' + myData.data[1] + ', ' + myData.data[2] + ')')
            if (myData.data[3] === 0) {
              color = '#fff'
            }
            resolve(color)
          }
        }
        img.src = image.toDataURL()
        canvas.width = 2
        canvas.height = 2
      })
    } else {
      reject(new Error('WebContents are not available'))
    }
  })
}

export const getColor = (webview) => {
  return new Promise((resolve, reject) => {
    if (webview != null && webview.getWebContents() != null) {
      // Checks if <meta name='theme-color' content='...'> tag exists.
      // When it exists, the tab's getting the color from content='...', 
      // otherwise it's getting color from top of a website.
      webview.executeJavaScript('(function () { return document.documentElement.innerHTML })()', false, async (result) => {
        const regexp = /<meta name='?.theme-color'?.*>/
        if (!regexp.test(result)) {
          // Getting color from top of a website.
          const color = await getColorFromTop(webview)
          resolve(color)
        }
      })
    } else {
      reject(new Error('WebContents are not available'))
    }
  })
}
