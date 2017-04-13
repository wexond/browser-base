class ExtensionAPI {
    constructor(tab, extensionWebview) {
        this.currentTab = tab;
        this.currentPage = tab.getPage();
        this.extensionWebview = extensionWebview;

        var t = this;

        this.extensionWebview.addEventListener('ipc-message', function(e) {
            /*
            * adds event to webview related to passed tab
            * @param1 {Object}
                * tab
                * event
            */
            if (e.channel == 'webview:addevent') {
                var page = t.getPageForTab(e.args[0].tab);
                page.getWebView().addEventListener(e.args[0].event, handleEvent);
            }
            /*
            * removes event to webview related to passed tab
            * @param1 {Object}
                * tab
                * event
            */
            if (e.channel == 'webview:removeevent') {
                var page = t.getPageForTab(e.args[0].tab);
                page.getWebView().removeEventListener(e.args[0].event, handleEvent);
            }
            if (e.channel == 'tab:addevent') {
                var tabIndex = e.args[0].tab.index;
                var tab = t.getTab(tabIndex);
                tab.getDOMNode().addEventListener(e.args[0].event, handleEvent);
            }
            if (e.channel == 'tab:removeevent') {
                var tabIndex = e.args[0].tab.index;
                var tab = t.getTab(tabIndex);
                tab.getDOMNode().removeEventListener(e.args[0].event, handleEvent);
            }

            /*
            * gets tabs array transformed to IPC friendly array
            * @return {Object}
            */
            if (e.channel == 'tabs:gettabs') {
                var tempTabs = [];
                for (var i = 0; i < tabs.length; i++) {
                    var tab = t.prepareIPCTab(tabs[i]);
                    tempTabs.push(tab);
                }
                t.extensionWebview.send('tabs:gettabs', tempTabs);
            }
            /*
            * gets tab related to current extension and transformed to IPC friendly object
            * @return {Object}
            */
            if (e.channel == 'tabs:getcurrenttab') {
                var tab = t.prepareIPCTab(t.currentTab);
                tab.current = true;
                t.extensionWebview.send('tabs:getcurrenttab', tab);
            }
        });
        function handleEvent(e) {
            console.log(JSON.stringify(e));
            t.extensionWebview.send(e.type, e);
        }
    }
    /*
    * sends to extension dispose alert
    */
    dispose() {
        this.extensionWebview.send('api:dispose');
    }
    /*
    * reloads extensions
    */
    reload() {
        this.dispose();
        this.extensionWebview.reload();
    }
    /*
    * transforms tab to IPC friendly object
    * @return {Object}
    */
    prepareIPCTab(realTab) {
        return {
            background: realTab.background,
            foreground: realTab.foreground,
            title: realTab.getTitle(),
            favicon: realTab.getFaviconURL(),
            selected: realTab.isSelected(),
            index: realTab.getStaticIndex()
        };
    }
    /*
    * gets page related to tab
    * @param1 {Object} tab
    * @return {Page}
    */
    getPageForTab(tab) {
        if (tab.current) {
            return this.currentPage;
        } else {
            return this.getTab(tab.index).getPage();
        }
    }
    /*
    * gets tab by static index
    * @return {Tab}
    */
    getTab(index) {
        for (var i = 0; i < tabs.length; i++) {
            if (index == tabs[i].getStaticIndex()) {
                return tabs[i];
            }
        }
    }
}
