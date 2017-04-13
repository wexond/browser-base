'use babel';
import React from 'react';
import {TweenMax, CSSPlugin} from "gsap";
import Extensions from '../../../classes/extensions.js';
import Draggable from 'gsap/draggable';
import ReactDOM from 'react-dom';

export default class Tab extends React.Component {
    constructor() {
        super();
        //global properties
        this.locked = false;
        this.getPage = null;
        this.selected = false;
        this.extensions = null;
        this.staticIndex = -1;
        this.background = '#fff';
        this.foreground = '#212121';
        this.state = {
            title: "New tab",
            render: true,
            icon: ''
        };
    }
    /*
    lifecycle
    */
    componentDidMount() {
        this.getPage = this.props.page;
        var pass = this.getTab,
            t = this,
            tabbar = this.props.getTabBar();

        this.getPage().getTab = pass;
        tabs.push(this);

        TweenMax.set(this.refs.tab, {
            css: {
                left: tabbar.getPositions()[tabs.indexOf(this)]
            }
        });
        tabbar.calcWidths(true);
        tabbar.calcPositions(true, true);

        tabbar.getWidths(function(width) {
            if (width < t.props.maxTabWidth) {
                t.refs.tab.css({width: 0, marginLeft: width});
            } else {
                t.refs.tab.css({width: 0});
            }
            TweenMax.to(t.refs.tab, tabsAnimationDuration, {
                width: width,
                ease: Circ.easeOut,
                onComplete: function() {
                    tabbar.calcWidths(true);
                    tabbar.calcPositions(true, true);
                }
            });
        });

        this.getPage().focusSearchInput();

        this.drag = Draggable.create(this.refs.tab, {
            onDragStart: this.onDragStart,
            onRelease: this.onRelease,
            onDrag: this.onDrag,
            type: "left",
            cursor: "default"
        });

        var closed = false;
        this.refs.tab.addEventListener("click", function(e) {
            if (e.which == 2 && !closed) {
                closed = true;
                t.props.getTabBar().removeTab(t);
            }
        });
        if (this.getPage().select) {
            tabbar.selectTab(this);
        } else {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].selected) {
                    tabbar.selectTab(tabs[i]);
                }
            }
        }
        this.extensions = new Extensions(this);
        this.loadExtensions();

        this.staticIndex = tabs.indexOf(this);
    }
    /*
    events
    */
    onDragStart = () => {
        this.props.getTabBar().selectTab(this);
    }
    /*
    * @param1 {Object} e
    */
    onRelease = (e) => {
        this.props.getTabBar().calcPositions(true, true);
    }
    /*
    * @param1 {Object} e
    */
    onDrag = (e) => {
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].refs.tab.style.zIndex = 1;
        }
        this.refs.tab.style.zIndex = 9999;
        this.reorderTabs(e.pageX);
    }
    onMouseDown = () => {
        this.props.getTabBar().selectTab(this);
    }
    onMouseEnter = () => {
        if (!this.isSelected()) {
            TweenMax.to(this.refs.tab, 0.5, {
                backgroundColor: `rgba(255,255,255,${tabsHoverTransparency})`,
                ease: tabsAnimationEasing
            });
            TweenMax.to(this.refs.closeBtn, 0.2, {
                opacity: 0.6,
                ease: tabsAnimationEasing
            });
            this.refs.title.css('max-width', 'calc(100% - 64px)');
        }
    }
    onMouseLeave = () => {
        if (!this.isSelected()) {
            TweenMax.to(this.refs.tab, 0.5, {
                backgroundColor: 'rgba(255,255,255,0)',
                ease: tabsAnimationEasing
            });
            TweenMax.to(this.refs.closeBtn, 0.2, {
                opacity: 0,
                ease: tabsAnimationEasing
            });
            this.refs.title.css('max-width', 'calc(100% - 48px)');
        }
    }
    /*
    * @param1 {Object} e
    */
    onMouseLeaveCloseBtn(e) {
        TweenMax.to(e.target, 0.2, {
            opacity: 0.6,
            ease: tabsAnimationEasing
        });
    }
    /*
    * @param1 {Object} e
    */
    onMouseEnterCloseBtn(e) {
        TweenMax.to(e.target, 0.2, {
            opacity: 1,
            ease: tabsAnimationEasing
        });
    }
    /*
    * @param1 {Object} e
    */
    onClickCloseBtn = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.props.getTabBar().removeTab(this);
    }
    /*
    * gets tabbar
    * @return {Tabbar}
    */
    getTabbar = () => {
        return this.props.getTabBar();
    }
    /*
    * @return {Boolean}
    */
    isSelected = () => {
        return this.selected;
    }
    /*
    * sets background
    * @param1 {String} color
    */
    setBackground = (color) => {
        this.background = color;
        if (this.selected) {
            this.refs.tab.css('background-color', color);
        }
    }
    /*
    * sets foreground
    * @param1 {String} color
    * @param2 {Boolean} force - can set foreground even the tab is unselected?
    */
    setForeground = (color, force) => {
        this.foreground = color;

        if (force) {
            this.refs.tab.css('color', color);
            if (color == 'white') {
                this.refs.closeBtn.addClass('white-icon');
            } else {
                this.refs.closeBtn.removeClass('white-icon');
            }
        } else {
            if (this.selected) {
                this.refs.tab.css('color', color);
                if (color == 'white') {
                    this.refs.closeBtn.addClass('white-icon');
                } else {
                    this.refs.closeBtn.removeClass('white-icon');
                }
            }
        }
    }
    /*
    * gets index of current tab
    * @return {Number}
    */
    getIndex = () => {
        return tabs.indexOf(this);
    }
    /*
    * gets static index of current tab
    * @return {Number}
    */
    getStaticIndex = () => {
        return this.staticIndex;
    }
    /*
    * changes tab's title
    * @param1 {String} newTitle
    */
    changeTitle = (newTitle) => {
        this.setState({title: newTitle});
    }
    /*
    * gets title
    * @return {String}
    */
    getTitle = () => {
        return this.state.title;
    }
    /*
    * gets favicon URL
    * @return {String}
    */
    getFaviconURL = () => {
        return this.getPage().pageData.favicon;
    }
    /*
    * changes favicon
    * @param1 {String} favicon
    */
    changeFavicon = (favicon) => {
        this.setState({icon: `url(${favicon}`});
    }
    /*
    * returns this
    * @return {Tab}
    */
    getTab = () => {
        return this;
    }
    /*
    * reorders tabs
    * @param1 {Number} cursorX
    */
    reorderTabs = (cursorX) => {
        var overTab = this.props.getTabBar().getTabFromMousePoint(this, cursorX);
        if (overTab != null) {
            var indexTab = tabs.indexOf(this),
                indexOverTab = tabs.indexOf(overTab);
            this.props.getTabBar().replaceTabs(indexTab, indexOverTab, this, overTab);

        }
    }
    /*
    * loads only extensions that are related to current page
    */
    loadExtensions = () => {
        var t = this;
        this.extensions.deleteExtensions();
        this.extensions.loadExtensions(function(data) {
            t.extensions.addExtensionToMenu(data, t.getPage().getMenu());
        });
    }
    /*
    * gets DOM node for tab
    * @return {DOMElement}
    */
    getDOMNode = () => {
        return ReactDOM.findDOMNode(this);
    }

    render() {
        var style1 = {
            width: 100
        };
        var style2 = {
            left: 0
        };
        if (this.state.render) {
            return (
                <div ref="tab" onMouseDown={this.onMouseDown} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={style1} className="tab draggable">
                    <div className="border-horizontal" style={style2}></div>
                    <div className="content">
                        <div ref="favicon" style={{backgroundImage: this.state.icon}} className="favicon"></div>
                        <div className="tabTitle" ref="title">{this.state.title}</div>
                        <div className="closeBtn" ref="closeBtn" onMouseEnter={this.onMouseEnterCloseBtn} onMouseLeave={this.onMouseLeaveCloseBtn} onClick={this.onClickCloseBtn}></div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}
