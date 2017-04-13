var remote = require('electron').remote;
var {ipcRenderer} = require('electron');

class WebView {
    constructor(page) {
        this.page = page;
        this.events = [];

        ipcRenderer.on('api:dispose', this.dispose);
    }
    addEventListener(event, callback) {
        var eventObj = {event: event, callback: callback, tab: prepareIPCTab(this.page.tab)};
        ipcRenderer.sendToHost("webview:addevent", eventObj);
        ipcRenderer.on(event, callback);
        this.events.push(eventObj);
    }
    removeEventListener(event, callback) {
        var eventObj = {event: event, callback: callback, tab: prepareIPCTab(this.page.tab)};
        ipcRenderer.sendToHost("webview:removeevent", eventObj);
        ipcRenderer.removeListener(event, callback);
        this.events.splice(this.events.indexOf(eventObj), 1);
    }
    dispose() {
        for (var i = 0; i < this.events.length; i++) {
            this.removeEventListener(this.events[i].event, this.events[i].callback);
        }
    }
}

class Page {
    constructor(tab) {
        this.tab = tab;
        this.webview = new WebView(this);
    }
}

class Tab {
    constructor(tab) {
        this.page = new Page(this);

        this.background = null;
        this.foreground = null;
        this.index = null;
        this.selected = null;
        this.favicon = null;
        this.title = null;

        this.events = [];

        ipcRenderer.on('api:dispose', this.dispose);
    }
    addEventListener(event, callback) {
        var t = this;
        var eventObj = {event: event, callback: callback, tab: prepareIPCTab(this)};
        ipcRenderer.sendToHost("tab:addevent", eventObj);
        ipcRenderer.on(event, callback);
        this.events.push(eventObj);
    }
    removeEventListener(event, callback) {
        var eventObj = {event: event, callback: callback, tab: prepareIPCTab(this)};
        ipcRenderer.sendToHost("tab:removeevent", eventObj);
        ipcRenderer.removeListener(event, callback);
        this.events.splice(this.events.indexOf(eventObj), 1);
    }
    dispose() {
        for (var i = 0; i < this.events.length; i++) {
            this.removeEventListener(this.events[i].event, this.events[i].callback);
        }
    }
}

class Tabs {
    constructor() {

    }
    /*
    * gets tabs array
    * @param1 {function(tabs)} callback
    */
    getTabs(callback = null) {
        ipcRenderer.sendToHost('tabs:gettabs');
        ipcRenderer.on('tabs:gettabs', function(e, tabs) {
            var result = [];
            for (var i = 0; i < tabs.length; i++) {
                result.push(createTabClass(tabs[i]));
            }
            if (callback != null) {
                callback(result);
            }
        });
    }
    /*
    * gets tab by index
    * @param1 {Number} index
    * @param2 {function(Tab)} callback
    */
    getTab(index, callback = null) {
        this.getTabs(function (tabs) {
            if (callback != null) {
                callback(createTabClass(tabs[index]));
            }
        });
    }
    /*
    * gets current tab attached to extension
    * @param1 {function(Tab)} callback
    */
    getCurrentTab(callback = null) {
        ipcRenderer.sendToHost('tabs:getcurrenttab');
        ipcRenderer.on('tabs:getcurrenttab', function(e, tab) {
            if (callback != null) {
                callback(createTabClass(tab));
            }
        });
    }
}

class Wexond {
    constructor() {
        this.tabs = new Tabs();
    }
}

/*
* creates class for tab object
* @param1 {Object} tab
* @return {Tab}
*/
function createTabClass(tab) {
    var tabReturn = new Tab();
    tabReturn.background = tab.background;
    tabReturn.foreground = tab.foreground;
    tabReturn.selected = tab.selected;
    tabReturn.favicon = tab.favicon;
    tabReturn.title = tab.title;
    tabReturn.index = tab.index;

    return tabReturn;
}
/*
* converts Tab class to IPC friendly object
* @param1 {Tab} tab
* @return {Object}
*/
function prepareIPCTab(tab) {
    var tabReturn = {
        background: tab.background,
        foreground: tab.foreground,
        title: tab.title,
        favicon: tab.favicon,
        selected: tab.selected,
        index: tab.index
    };

    return tabReturn;
}

global.wexond = new Wexond();
