var {app, BrowserWindow} = require('electron'),
    protocol = require('electron').protocol,
    remote = require('electron').remote,
    path = require('path');

let mainWindow;

/*
global events
*/
app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
process.on('uncaughtException', function () {

});

/*
* prepares browser window-all-closed
*/
function createWindow() {
    mainWindow = new BrowserWindow({width: 900, height: 700, frame: false, minWidth: 300, minHeight: 430, tabs: null});
    mainWindow.loadURL('file://' + __dirname + '/../app/renderer/public/index.html');
    mainWindow.setMenu(null);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.on('unresponsive', function () {});

    if (process.env.ENV == 'dev') {
        mainWindow.webContents.openDevTools();
    }
}

/*
* creates protocol wexond://
*/
protocol.registerStandardSchemes(['wexond']);
app.on('ready', function () {
    protocol.registerFileProtocol('wexond', (request, callback) => {
        var url = request.url.substr(9);
        var lastChar = url.substr(url.length - 1);
        var s = url.split("/");
        if (lastChar != "/") {
            url = url.replace(s[0], "");
        }
        if (lastChar == "/") {
            url = url.substring(0, url.length - 1);
            url += ".html";
        }
        callback({
            path: path.normalize(`${__dirname}/../app/renderer/public/${url}`)
        });
    }, (error) => {
        if (error) console.error('Failed to register protocol');
    });
    createWindow();
});

/*
* registry
*/
/*
    HKEY_CLASSES_ROOT
    	.html
    		`OpenWithProgids
    			+Wexond.html (REG_SZ)
    	Wexond.html
    		`Application
    			+ApplicationCompany (REG_SZ) -> Nersent
    			+ApplicationDescription (REG_SZ) -> Search the internet
    			+ApplicationIcon(REG_SZ) -> C:\Users\user\Desktop\Wexond\logo.ico
    		`DefaultIcon
    			Default (REG_SZ) -> C:\Users\user\Desktop\Wexond\logo.ico
    		`shell
    			`open
    				`command
    					Default (REG_SZ) -> "C:\Users\Mikolaj\Desktop\user\Compiled\Wexond.exe" "1.0" "%1"
*/

global.start = {
    args: process.argv,
    file: false
};
