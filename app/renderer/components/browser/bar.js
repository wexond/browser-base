'use babel';
import React from 'react';
import Storage from '../../../classes/storage.js';

export default class Bar extends React.Component {
    constructor() {
        super();
        //global properties
        this.timeout = null;
        this.shown = false;
        this.bookmarkExist = false;
        this.lastTitle = null;
        this.lastUrl = null;
        this.lastFavicon = null;
        this.lastColor = null;
    }
    /*
    lifecycle
    */
    componentDidMount() {
        var t = this;
        document.body.addEventListener('mousemove', function(e) {
            if (e.pageY > 130 && !t.openedMenu && !t.locked) {
                t.hide();
                t.shown = false;
            }
            if (e.pageY <= 32) {
                clearTimeout(t.timeout);
                t.show();
                t.shown = true;
            }
            if (e.pageY < 82 && t.shown) {
                clearTimeout(t.timeout);
            }
        });
    }
    /*
    * shows bar
    */
    show = () => {
        if (this.refs.bar != null) {
            this.refs.bar.css('display', 'block');
            TweenMax.to(this.refs.bar, 0.2, {
                css: {
                    top: 8,
                    opacity: 1
                }
            });
        }
    }
    /*
    * hides bar
    */
    hide = () => {
        var t = this;
        if (this.refs.bar != null) {
            TweenMax.to(this.refs.bar, 0.2, {
                css: {
                    top: -8,
                    opacity: 0
                },
                onComplete: function() {
                    t.refs.bar.css('display', 'none');
                }
            });
        }
    }
    /*
    events
    */
    /*
    * @param1 {Object} e
    */
    handleInput = (e) => {
        var suggestions = this.props.getPage().getSuggestions();
        suggestions.show(e.target.value);
    }
    /*
    * @param1 {Object} e
    */
    handleFocusIn = (e) => {
        e.target.setSelectionRange(0, e.target.value.length);
    }
    /*
    * @param1 {Object} e
    */
    handleKeyPress = (e) => {
        var webview = this.props.getPage().getWebView(),
            suggestions = this.props.getPage().getSuggestions();
        //if enter key was pressed
        if (e.which == 13) {
            this.locked = false;
            suggestions.hide();
            if (!e.target.value.startsWith("wexond://")) {
                if (isURL(e.target.value)) {
                    if (e.target.value.startsWith("http://") || e.target.value.startsWith("https://") || e.target.value.startsWith("file://")) {
                        webview.loadURL(e.target.value);
                    } else {

                        webview.loadURL("http://" + e.target.value);
                    }
                } else {
                    //TODO: search engines
                    webview.loadURL("http://www.google.com/search?q=" + e.target.value);
                }
            } else {
                webview.loadURL(e.target.value);
            }

            return false;
        }
    }
    onClickBack = () => {
        this.props.getPage().getWebView().goBack();
    }
    onClickForward = () => {
        this.props.getPage().getWebView().goForward();
    }
    onClickRefresh = () => {
        this.props.getPage().getWebView().reload();
    }
    /*
    * @param1 {Object} e
    */
    ripple(e) {
        var ripple = Ripple.createRipple(e.target, {}, createRippleCenter(e.target, 13));
        Ripple.makeRipple(ripple);
    }

    onClickFavourite = () => {
        var t = this;
        var title = this.props.getPage().getWebView().getTitle();
        var url = this.props.getPage().getWebView().getURL();
        var favicon = this.props.getPage().pageData.favicon;
        var color = this.props.getPage().pageData.color;

        this.data = {
          url: url,
          favicon: favicon,
          color: color,
          name: title
        };

        if (!this.bookmarkExist) {
          this.props.getPage().setSnackbarText("Added a new bookmark!");
          Storage.addBookmark(this.data, function() {
              t.props.getPage().getSnackbar().show();
              t.setFavouriteIconFull(true);
          });
          this.bookmarkExist = true;
        } else {
          this.props.getPage().setSnackbarText("Removed the bookmark!");
          Storage.getBookmarkIndex(url, function(index) {
            Storage.delBookmark(index, function() {
              t.props.getPage().getSnackbar().show();
              t.setFavouriteIconFull(false);
            });
          });
          this.bookmarkExist = false;
        }

    }

    onSnackbarButtonClick = () => {
        var t = this;
        t.props.getPage().getSnackbar().hide();
        if (!this.bookmarkExist) {
            Storage.addBookmark(this.data, function() {
                t.setFavouriteIconFull(true);
            });
            this.bookmarkExist = true;
        } else if (this.bookmarkExist) {
            Storage.getBookmarkIndex(this.data.url, function(index) {
                if (index != undefined) {
                    Storage.delBookmark(index, function() {
                        t.setFavouriteIconFull(false);
                    });
                }
            });
            this.bookmarkExist = false;
        }
    }

    /*
    * @param1 {Object} e
    */
    onClickMenu = (e) => {
        e.stopPropagation();
        this.props.getPage().getMenu().showOrHide();
    }
    /*
    * gets favourite icon
    * @return {DOMElement}
    */
    getFavouriteIcon = () => {
        return this.refs.favourite_icon;
    }
    /*
    * sets favourite icon full or empty
    * @param1 {Boolean} f
    */
    setFavouriteIconFull = (f) => {
        this.refs.favourite_icon.classList.remove("favourite-icon-full");
        if (f) {
            this.refs.favourite_icon.classList.add("favourite-icon-full");
        }
        this.bookmarkExist = f;
    }
    /*
    * gets search input
    * @return {DOMElement}
    */
    getSearchInput = () => {
        return this.refs.searchInput;
    }

    render() {
        return (
            <div className="bar" ref="bar">
                <div className="bar-icon back ripple-bar-icon no-select" onClick={this.onClickBack} onMouseDown={this.ripple}></div>
                <div className="bar-icon forward ripple-bar-icon no-select" onClick={this.onClickForward} onMouseDown={this.ripple}></div>
                <div className="bar-icon refresh ripple-bar-icon no-select" onClick={this.onClickRefresh} onMouseDown={this.ripple}></div>
                <div className="border-horizontal no-select" style={{
                    backgroundColor: '#212121',
                    position: 'relative',
                    float: 'left',
                    marginLeft: 12,
                    height: 'calc(100% - 24px)'
                }}></div>
                <div className="search-icon no-select" style={{
                    marginLeft: 12
                }}></div>
                <input onKeyPress={this.handleKeyPress} onFocus={this.handleFocusIn} onInput={this.handleInput} ref="searchInput" className="searchInput"></input>
                <div className="bar-icon menu-icon ripple-bar-icon no-select" onMouseDown={this.ripple} onClick={this.onClickMenu}></div>
                <div className="border-horizontal no-select" style={{
                    backgroundColor: '#212121',
                    position: 'relative',
                    float: 'right',
                    marginLeft: 10,
                    marginRight: 2,
                    height: 'calc(100% - 24px)'
                }}></div>
                <div className="bar-icon favourite-icon ripple-bar-icon no-select" ref="favourite_icon" onMouseDown={this.ripple} onClick={this.onClickFavourite}></div>
            </div>
        );
    }
}
