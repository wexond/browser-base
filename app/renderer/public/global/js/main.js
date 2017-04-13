const {remote, clipboard} = require('electron');
const {Menu, MenuItem} = remote;

var app = remote.app,
    appData = app.getPath('userData'),
    userData = appData + '/userdata',
    historyPath = userData + '/history.json',
    extensionsPath = userData + '/extensions',
    dir = require('node-dir'),
    fs = require('fs'),
    tabsAnimationDuration = 0.3,
    tabsAnimationEasing,
    tabsHoverTransparency = 0.1,
    tabs = [],
    bookmarksDataPath = userData + '/bookmarks.json';

function checkFiles() {
    //check if directory called userdata exists
    if (!fs.existsSync(userData)) {
        fs.mkdir(userData);
    }
    //check if directory called extensions exists
    if (!fs.existsSync(extensionsPath)) {
        fs.mkdir(extensionsPath);
    }
    //check if file called history.json exists
    if (!fs.existsSync(historyPath)) {
        fs.writeFile(historyPath, '{"history":[]}');
    }
    //check if file called bookmarks.json exists
    if (!fs.existsSync(bookmarksDataPath)) {
        fs.writeFile(bookmarksDataPath, '{"bookmarks":[]}');
    }
}

if (process.env.ENV == 'dev') {
    remote.getCurrentWindow().webContents.openDevTools();
}

console.log(process.versions.electron);
