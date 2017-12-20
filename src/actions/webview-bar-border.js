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
