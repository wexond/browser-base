export default class Colors {
    constructor(webview) {
        this.webview = webview;
    }
    /*
    * calculates foreground color based on background color
    * @param1 {String} color
    */
    static getForegroundColor(color) {
        var brightness = colorBrightness(color);
        if (brightness < 125) {
            return 'white';
        } else {
            return 'black';
        }
    }
    /*
    * gets color from top of website
    * @param1 {Function} callback
    */
    getColorFromTop(callback = null) {
        var t = this;
        if (typeof(this.webview) !== "undefined" && this.webview != null && this.webview.getWebContents() != null) {
            t.webview.capturePage({
                x: 1,
                y: 1,
                width: 2,
                height: 2
            }, function(image) {
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                var img = new Image();
                img.onload = function() {
                    context.drawImage(img, 0, 0);
                    var myData = context.getImageData(1, 1, 1, 1);
                    if (myData != null) {

                        var color = rgbToHex(myData.data[0], myData.data[1], myData.data[2]);
                        if (myData.data[3] == 0) {
                            color = "#fff";
                        }
                        if (typeof(callback) === 'function') {
                            callback({foreground: Colors.getForegroundColor(color), background: color});
                        }
                    }
                };
                img.src = image.toDataURL();
                canvas.width = 2;
                canvas.height = 2;
            });
        }
    }
    /*
    * gets color from html tag <meta name="theme-color".../>
    * @param1 {String} htmlcode
    * @param2 {Function} callback
    */
    getColorFromSource(htmlcode, callback = null) {
        var regexp = /<meta name='?.theme-color'?.*>/;
        var regex = htmlcode.match(regexp).toString();
        var color = regex.match(/content="(.*?)"/)[1];
        if (typeof(callback) === 'function') {
            callback({foreground: Colors.getForegroundColor(color), background: color});
        }
    }
    /*
    * determines whether to get a color from the code or website
    * @param1 {Function} callback
    */
    getColor(callback = null) {
        var t = this;
        if (this.webview != null && this.webview.getWebContents() != null) {
            //check if <meta name="theme-color" content="..."> tag exists. When it exists then tab gets the color from content="...", otherwise it getting color from top of a website
            t.webview.executeJavaScript("function s() {var markup = document.documentElement.innerHTML; return markup} s();", false, function(result) {
                var regexp = /<meta name='?.theme-color'?.*>/;
                if (regexp.test(result)) {
                    //getting color from source (theme-color)
                    if (typeof(callback) === 'function') {
                        t.getColorFromSource(result, function(color) {
                            callback({foreground: color.foreground, background: color.background});
                        });
                    }
                } else {
                    //getting color from top of a website
                    if (typeof(callback) === 'function') {
                        t.getColorFromTop(function(color) {
                            callback({foreground: color.foreground, background: color.background});
                        });
                    }
                }
            });
        }
    }
}
