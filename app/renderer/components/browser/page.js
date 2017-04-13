'use babel';
import React from 'react';
import Bar from './bar.js';
import Suggestions from './suggestions.js';
import Storage from '../../../classes/storage.js';
import Colors from '../../../classes/colors.js';
import MDMenu from '../menu/menu.js';
import Snackbar from '../materialdesign/snackbar.js';
import Find from './find.js';
import ReactDOM from 'react-dom';

export default class Page extends React.Component {
    constructor() {
        super();
        //global properties
        this.menu = new Menu();
        this.posToInspect = {
            x: 0,
            y: 0
        };
        this.getTab = null;
        this.menuItems = [];
        this.imageToSave = '';
        this.linkToOpen = '';
        this.pageData = {
            url: '',
            title: '',
            favicon: '',
            color: ''
        };

        this.state = {
            render: true,
            snackbartext: "Added bookmark!"
        };

        checkFiles();
    }
    /*
    * lifecycle
    */
    componentDidMount() {
        this.prepareContextMenu();
        var pageObj = this.getPage,
            webview = this.getWebView(),
            bar = this.getBar(),
            t = this;

        this.select = this.props.select;

        this.props.getApp().addTab(pageObj);

        this.resize();
        window.addEventListener('resize', this.onResize);

        //webview events
        webview.addEventListener('page-title-updated', this.onPageTitleUpdate);
        webview.addEventListener('dom-ready', this.onReady);
        webview.addEventListener('did-frame-finish-load', this.onFrameFinishLoad);
        webview.addEventListener('page-favicon-updated', this.onFaviconUpdate);
        webview.addEventListener('new-window', this.onNewWindow);
        webview.addEventListener('enter-html-full-screen', this.onFullScreenEnter);
        webview.addEventListener('leave-html-full-screen', this.onFullScreenLeave);
        webview.addEventListener('found-in-page', (e) => {
            try {
                var matches = e.result.matches;
                var activeMatche = e.result.activeMatchOrdinal;
                t.refs.findpanel.setMatches(activeMatche, matches);
            } catch (e) {}
        });

        //colors
        this.colors = new Colors(this.getWebView());
        this.colorInterval = setInterval(this.updateColors, 200);
        //mouse events
        var lastLink = '';
        webview.addEventListener('ipc-message', function(e) {
            if (e.channel == 'scroll') {
                if (lastLink != e.args[0]) {
                    t.props.getApp().addPage({url: e.args[0], select: false});
                    lastLink = e.args[0];
                    setTimeout(function() {
                        lastLink = '';
                    }, 50);
                }
            }
            if (e.channel == 'LMB') {
                t.getMenu().hide();
                t.getSuggestions().hide();
            }
            if (e.channel == 'update-favourites') {
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].getPage() != null) {
                        tabs[i].getPage().updateFavouriteIcon();
                    }
                }
            }
        });
        //when adding new tab don't hide bar
        this.getBar().locked = true;
        this.getBar().show();

        document.addEventListener('keyup', function(e) {
            //CTRL + F
            if (e.ctrlKey && e.keyCode == 70) {
                t.refs.findpanel.setVisible((t.refs.findpanel.isOpened())
                    ? false
                    : true);
            }
        }, false);
    }
    /*
    events
    */
    onReady = () => {
        var webview = this.getWebView();

        webview.getWebContents().removeListener('context-menu', this.onContextMenu);
        webview.getWebContents().on('context-menu', this.onContextMenu, false);
        webview.getWebContents().send('env', process.env.ENV);
    }
    /*
    * @param1 {Object} e
    */
    onPageTitleUpdate = (e) => {
        var webview = this.getWebView();
        this.getTab().changeTitle(e.title);
        this.pageData.title = e.title;
        this.pageData.url = webview.getURL();
    }
    /*
    * @param1 {Object} e
    */
    onFrameFinishLoad = (e) => {
        var t = this,
            webview = this.getWebView(),
            bar = this.getBar();
        if (webview.getURL() != this.props.getApp().defaultURL) {
            bar.getSearchInput().value = webview.getURL();
            bar.locked = false;
        } else {
            bar.locked = true;
            bar.show();
        }
        if (e.isMainFrame && !webview.getURL().startsWith("wexond://history") && !webview.getURL().startsWith("wexond://newtab")) {
            Storage.saveHistory(webview.getTitle(), webview.getURL());
        }
        this.pageData.url = webview.getURL();
        if (!webview.getURL().startsWith("wexond://history") && !webview.getURL().startsWith("wexond://newtab")) {
            this.getBar().getFavouriteIcon().style.display = 'block';
            this.updateFavouriteIcon();
        } else {
            this.getBar().getFavouriteIcon().style.display = 'none';
        }
    }
    /*
    * @param1 {Object} e
    */
    onNewWindow = (e) => {
        this.props.getApp().addPage({url: e.url, select: true});
    }
    /*
    * @param1 {Object} e
    */
    onFullScreenEnter = (e) => {
        this.props.getApp().getTitlebar().setVisible(false);
    }
    /*
    * @param1 {Object} e
    */
    onFullScreenLeave = (e) => {
        this.props.getApp().getTitlebar().setVisible(true);
    }
    /*
    * @param1 {Object} e
    */
    onFaviconUpdate = (e) => {
        this.getTab().changeFavicon(e.favicons[0]);
        this.pageData.favicon = e.favicons[0];
    }
    onResize = () => {
        this.resize();
    }
    onSnackbarButtonClick = () => {
        this.refs.bar.onSnackbarButtonClick();
    }
    /*
    * @param1 {Object} e
    * @param2 {Object} params
    */
    onContextMenu = (e, params) => {

        /*
        * Menu items:
        * 0: open image in new tab
        * 1: open link in new tab
        * 2: back
        * 3: forward
        * 4: refresh
        * 5: separator1
        * 6: copy link
        * 7: save image as
        * 8: print
        * 9: separator2
        * 10: inspect element
        * 11: view source
        */

        var webview = this.getWebView();

        e.preventDefault();

        this.imageToSave = '';
        this.linkToOpen = '';

        if (params.mediaType == 'image') {
            this.imageToSave = params.srcURL;
        } else {
            this.imageToSave = '';
        }

        this.linkToOpen = params.linkURL;

        this.cleanContextMenu();

        this.posToInspect = {
            x: params.x,
            y: params.y
        };
        this.menu.popup(remote.getCurrentWindow());
    }
    /*
    * makes context menu clean
    */
    cleanContextMenu = () => {
        this.menuItems[1].visible = (this.linkToOpen == "")
            ? false
            : true;
        if (this.menuItems[1].visible || this.menuItems[0].visible) {
            for (var i = 2; i < 5; i++) {
                this.menuItems[i].visible = false;
            }
            this.menuItems[8].visible = false;
        } else {
            for (var i = 2; i < 5; i++) {
                this.menuItems[i].visible = true;
            }
            this.menuItems[8].visible = true;
        }
        if (this.menuItems[1].visible) {
            this.menuItems[6].visible = true;
        } else {
            this.menuItems[6].visible = false;
        }
        if (this.menuItems[0].visible) {
            this.menuItems[7].visible = true;
        } else {
            this.menuItems[7].visible = false;
        }
        this.menuItems[0].visible = (this.imageToSave == "")
            ? false
            : true;
    }
    /*
    * appends and prepares context menu items
    */
    prepareContextMenu = () => {
        var webview = this.getWebView(),
            t = this;
        this.menu = new Menu();

        //open image in new tab menu item id: 0
        this.menuItems.push(new MenuItem({
            label: 'Open image in new tab',
            click() {
                if (t.imageToSave != "") {
                    //add new tab
                    t.props.getApp().addPage({url: t.imageToSave, select: false});
                }
            }
        }));
        //open link in new tab menu item id: 1
        this.menuItems.push(new MenuItem({
            label: 'Open link in new tab',
            click() {
                if (t.linkToOpen != "") {
                    //add new tab
                    t.props.getApp().addPage({url: t.linkToOpen, select: false});
                }
            }
        }));
        //back menu item id: 2
        this.menuItems.push(new MenuItem({
            label: 'Back',
            click() {
                webview.goBack();
            }
        }));
        //forward menu item id: 3
        this.menuItems.push(new MenuItem({
            label: 'Forward',
            click() {
                webview.goForward();
            }
        }));
        //refresh menu item id: 4
        this.menuItems.push(new MenuItem({
            label: 'Reload',
            click() {
                t.getBar().refresh();
            }
        }));
        //separator 1 id: 5
        this.menuItems.push(new MenuItem({type: 'separator'}));
        //copy link menu item id: 6
        this.menuItems.push(new MenuItem({
            label: 'Copy link address',
            click() {
                if (t.linkToOpen != "") {
                    clipboard.writeText(t.linkToOpen);
                }
            }
        }));
        //save image as menu item id: 7
        this.menuItems.push(new MenuItem({label: 'Save image as', click() {
                //saves image as
            }}));
        //print menu item id: 8
        this.menuItems.push(new MenuItem({label: 'Print', click() {
                //prints webpage
            }}));
        //separator 2 id: 9
        this.menuItems.push(new MenuItem({type: 'separator'}));
        //inspect element menu item id: 10
        this.menuItems.push(new MenuItem({
            label: 'Inspect element',
            click() {
                webview.inspectElement(t.posToInspect.x, t.posToInspect.y);
            }
        }));
        //view source menu item id: 11
        this.menuItems.push(new MenuItem({label: 'View source', click() {
                //views source
            }}));

        for (var i = 0; i < this.menuItems.length; i++) {
            this.menu.append(this.menuItems[i]);
        }
        this.cleanContextMenu();
    }
    /*
    * open new tab with url
    * @param1 {String} u - url
    * @param2 {Boolean} select - can select new tab?
    */
    addTab = (u, select) => {
        this.props.getApp().addPage({url: u, select: select});
    }
    /*
    * gets colors from website
    */
    updateColors = () => {
        var t = this;
        if (this.getTab() != null || typeof this.getTab() !== 'undefined') {
            if (remote != null) {
                if (this.getTab().isSelected() && !remote.getCurrentWindow().isMinimized()) {
                    this.colors.getColor(function(data) {
                        if (remote != null) {
                            if (t.getTab().isSelected() && !remote.getCurrentWindow().isMinimized()) {
                                if (t.pageData.color != data.background) {
                                    var evt = document.createEvent('Event');
                                    evt.initEvent('color-update', true, true);
                                    evt.color = data.background;
                                    ReactDOM.findDOMNode(t.getTab()).dispatchEvent(evt);
                                }
                                /*if (t.refs.bar != null) {
                                    t.refs.bar.refs.bar.css('background-color', data.background);
                                }*/
                                t.props.getApp().getTitlebar().setBackground(shadeColor(data.background, -0.2));
                                t.getTab().setBackground(data.background);
                                t.changeForeground(data.foreground, data.foreground == 'white'
                                    ? '#fff'
                                    : '#444');
                                t.getTab().setForeground(data.foreground, false);
                                t.pageData.color = data.background;
                            }
                        }
                    });
                }
            }
        }
    }
    /*
    * changes foreground of tab and bar
    * @param1 {String} color
    */
    changeForeground = (color) => {
        this.getTab().foreground = color;
        if (this.getBar() != null) {
            var barIcons = this.getBar().refs.bar.getElementsByClassName('bar-icon');
            if (color == 'white') {
                tabsHoverTransparency = 0.1;
            } else if (color == 'black' || color == 'semiblack') {
                tabsHoverTransparency = 0.4;
            }
        }
    }
    /*
    * disables page render
    */
    removePage = () => {
        this.setState({render: false});
        clearInterval(this.colorInterval);
    }
    /*
    * focuses search input
    */
    focusSearchInput = () => {
        if (this.getBar().getSearchInput().value == '') {
            this.getBar().getSearchInput().focus();
        }
    }
    /*
    * reloads only extensions that are related to current page
    */
    reloadExtensions = () => {
        var t = this;
        this.extensions.reloadExtensions();
    }
    /*
    * resizes WebView to match parent width and height
    */
    resize = () => {
        var barHeight = 0,
            tabsHeight = 32,
            height = tabsHeight,
            width = 0;
        if (this.getWebView() != null) {
            this.getWebView().style.height = window.innerHeight - height + 'px';
            this.getWebView().style.width = window.innerWidth - width + 'px';
        }
    }
    /*
    * sets snackbar text
    * @param1 {String} text
    */
    setSnackbarText = (text) => {
        this.setState({snackbartext: text});
    }
    /*
    * returns this
    * @return {Object}
    */
    getPage = () => {
        return this;
    }
    /*
    * returns webview
    * @return {DOMElement}
    */
    getWebView = () => {
        return this.refs.webview;
    }
    /*
    * returns menu
    * @return {DOMElement}
    */
    getMenu = () => {
        return this.refs.menu;
    }
    /*
    * returns bar
    * @return {DOMElement}
    */
    getBar = () => {
        return this.refs.bar;
    }
    /*
    * returns suggestions
    * @return {DOMElement}
    */
    getSuggestions = () => {
        return this.refs.suggestions;
    }
    /*
    * returns snackbar
    * @return {DOMElement}
    */
    getSnackbar = () => {
        return this.refs.snackbar;
    }
    /*
    * sets snackbar text
    * @param1 {String} text
    */
    setSnackbarText = (text) => {
        this.setState({snackbartext: text});
    }
    /*
    * updates favourite icon
    */
    updateFavouriteIcon = () => {
        var t = this;
        this.getBar().setFavouriteIconFull(false);
        setTimeout(function() {
            Storage.getBookmarkIndex(t.getWebView().getURL(), function(i) {
                t.getBar().setFavouriteIconFull(true);
            });
        }, 100);
    }
    /*
    * gets find panel
    * @return {Find}
    */
    getFindPanel() {
        return this.refs.findpanel;
    }

    render() {
        var t = this;

        if (this.state.render) {
            return (
                <div className="page" ref="page">
                    <Bar ref="bar" getPage={t.getPage}></Bar>
                    <Suggestions ref="suggestions" getPage={t.getPage}></Suggestions>
                    <webview preload="../../classes/preloads/global.js" className="webview" ref="webview" src={this.props.url}></webview>
                    <MDMenu ref="menu" getPage={t.getPage} addTab={(u, s) => this.addTab(u, s)}></MDMenu>
                    <Snackbar ref="snackbar" flatButton={true} flatButtonText="UNDO" onFlatButtonClick={this.onSnackbarButtonClick}>{this.state.snackbartext}</Snackbar>
                    <Find ref="findpanel" getPage={t.getPage}></Find>
                </div>
            );
        } else {
            return null;
        }
    }
}
