'use babel';
import React from 'react';
import Tab from './tab.js';
import Colors from '../../../classes/colors.js';
import {TweenMax, Expo, CSSPlugin} from "gsap";

export default class TabBar extends React.Component {
    constructor() {
        super();
        //global properties
        this.maxTabWidth = 190;
        this.actualTabWidth = this.maxTabWidth;
        this.canReset = false;
        this.timer = 0;
        tabsAnimationEasing = Expo.easeOut;
    }
    /*
    events
    */
    onClickAddTab = () => {
        this.props.getApp().addPage();
    }
    /*
    lifecycle
    */
    componentDidMount() {
        var t = this;
        window.addEventListener('resize', function() {
            t.calcWidths();
            t.calcPositions();
        });
        setInterval(function() {
            if (t.timer >= 3) {
                if (t.canReset) {
                    t.calcWidths(true);
                    t.calcPositions(true, true);
                    t.canReset = false;
                }
                t.timer = 0;
            }
            t.timer += 1;
        }, 1000);
        document.addEventListener('keyup', function(e) {
            //CTRL + W
            if (e.ctrlKey && e.keyCode == 87) {
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].selected) {
                        t.removeTab(tabs[i]);
                    }
                }
            }
        }, false);
        document.addEventListener('keyup', function(e) {
            //CTRL + O
            if (e.ctrlKey && e.keyCode == 79) {
                for (var i = 0; i < tabs.length; i++) {
                    if (!tabs[i].isSelected()) {
                        t.removeTab(tabs[i], false);
                    }
                }
                var i = tabs.length;
                while (i--) {
                    if (!tabs[i].isSelected()) {
                        tabs.splice(i, 1);
                    }
                }
                t.calcWidths(true, true);
                t.calcPositions(true, true);
            }
        }, false);
    }
    /*
    * selects tab
    * @param1 {Tab} tab
    */
    _selectTab(tab) {
        if (tab != null && tab.getPage() != null) {
            this.props.getApp().getTitlebar().setBackground(shadeColor(tab.background, -0.2));
            tab.getPage().resize();
            tab.refs.tab.style.zIndex = 9999;
            tab.getPage().refs.page.css({position: 'relative', opacity: 1, marginLeft: 0, height: '100%'});
            tab.setForeground(Colors.getForegroundColor(tab.background), false);
            TweenMax.set(tab.refs.tab, {backgroundColor: tab.background, 'color': tab.foreground});
            tab.selected = true;
            tab.refs.closeBtn.css('opacity' , 0.6);
            tab.refs.title.css('max-width', 'calc(100% - 64px)');
        }
    }
    /*
    * unselects tab
    * @param1 {Tab} tab
    */
    _deselectTab(tab) {
        if (tab != null && tab.getPage() != null) {
            tab.refs.tab.style.zIndex = 1;
            tab.getPage().refs.page.css({position: 'absolute', opacity: 0, height: 0, marginLeft: -9999 + 'px'});
            tab.refs.tab.css({
                backgroundColor: 'transparent',
                color: this.props.getApp().getTitlebar().foreground
            });
            tab.selected = false;
            tab.refs.closeBtn.css('opacity' , 0);
            tab.refs.title.css('max-width', 'calc(100% - 48px)');
        }
    }
    /*
    * selects tab and unselects others
    * @param1 {Tab} tab
    */
    selectTab = (tab) => {
        if (tab != null && tab.getPage().refs.page != null) {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i] == tab) {
                    //select
                    this._selectTab(tab);
                } else {
                    //deselect
                    this._deselectTab(tabs[i]);
                }
            }
        }
    }
    /*
    * selects tab by index and unselects others
    * @param1 {Number} index
    */
    selectTabByIndex = (index) => {
        if (tabs[index] != null && tabs[index].getPage().refs.page != null) {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i] == tabs[index]) {
                    //select
                    this._selectTab(tabs[index]);
                } else {
                    //deselect
                    this._deselectTab(tabs[i]);
                }
            }
        }
    }
    /*
    * removes tab
    * @param1 {Tab} tab
    */
    removeTab = (tab, removeFromArray = true) => {
        var newState = tab.state,
            index = tabs.indexOf(tab),
            t = this,
            newState2 = this.state;
        t.canReset = true;
        if (tabs.length == 1) {
            remote.getCurrentWindow().close();
        }
        if (removeFromArray)
            tabs.splice(index, 1);

        if (tab.isSelected()) {
            var prevTab = tabs[index - 1];
            if (prevTab == null) {
                this.selectTab(tabs[0]);
                tabs[0].getPage().focusSearchInput();
            } else {
                this.selectTab(prevTab);
                prevTab.getPage().focusSearchInput();
            }
        }
        if (index - 1 == tabs.length - 1) {
            if (tabs[0] != null) {
                if (tabs[0].refs.tab.offsetWidth < t.maxTabWidth) {
                    newState.render = false;
                    tab.getPage().removePage();
                    tab.setState(newState);
                    t.calcWidths(true);
                    t.calcPositions(true, true);
                } else {
                    TweenMax.to(tab.refs.tab, tabsAnimationDuration, {width: 0, ease: tabsAnimationEasing, onComplete: function() {
                        newState.render = false;
                        tab.setState(newState);
                        t.calcWidths(true);
                        t.calcPositions(true, true);
                    }});
                    tab.getPage().removePage();
                    t.calcWidths(true);
                    t.calcPositions(true, true);
                }
            }
        } else {
            t.calcPositions(true, true);
            TweenMax.to(tab.refs.tab, tabsAnimationDuration, {width: 0, ease: tabsAnimationEasing, onComplete: function() {
                newState.render = false;
                tab.setState(newState);
            }});
            tab.getPage().removePage();
            t.timer = 0;
        }
    }
    /*
    * gets tab from mouse point
    * @param1 {Tab} callingTab
    * @param2 {Number} cursorX
    * @return {Tab}
    */
    getTabFromMousePoint = (callingTab, cursorX) => {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i] != callingTab) {
                if (this.contains(tabs[i], cursorX)) {
                    if (!tabs[i].locked) {
                        return tabs[i];
                    }
                }
            }
        }
        return null;
    }
    /*
    * checks if {Tab}.refs.tab contains mouse x position
    * @param1 {Tab} tabToCheck
    * @param2 {Number} cursorX
    * @return {Boolean}
    */
    contains = (tabToCheck, cursorX) => {
        var rect = tabToCheck.refs.tab.getBoundingClientRect();

        if (cursorX >= rect.left && cursorX <= rect.right) {
            return true;
        }
        return false;
    }
    /*
    * sets widths for all tabs
    * @param1 {Boolean} animation
    */
    calcWidths = (animation = false) => {
        var tabbarwidth = this.refs.tabBarContainer.clientWidth,
            tabbar = this.refs.tabbar,
            addbtn = this.refs.addbtn,
            a = 0;
        for (var i = 0; i < tabs.length; i++) {
            var tabWidthTemp = (tabbarwidth - addbtn.offsetWidth - 2) / tabs.length;
            if (tabWidthTemp > this.maxTabWidth) {
                tabWidthTemp = this.maxTabWidth;
            }
            if (animation)
                TweenMax.to(tabs[i].refs.tab, tabsAnimationDuration, {width: tabWidthTemp, ease: tabsAnimationEasing});
            else
                tabs[i].refs.tab.style.width = tabWidthTemp + 'px';

            tabs[i].offsetWidth = tabWidthTemp;
            this.actualTabWidth = tabWidthTemp;
        }
        for (var i = 0; i < tabs.length; i++) {
            a += tabs[i].offsetWidth;
        }
    }
    /*
    * gets positions for tabs
    * @return {[]}
    */
    getPositions() {
        var tabCountTemp = 0,
            lefts = [],
            a = 0;

        for (var i = 0; i < tabs.length; i++) {
            lefts.push(a);
            a += tabs[i].offsetWidth;
        }
        return lefts;
    }
    /*
    * only calculates widths for all tabs
    * @param1 {Function} callback
    */
    getWidths = (callback = null) => {
        var tabbarwidth = this.refs.tabBarContainer.clientWidth,
            addbtn = this.refs.addbtn;
        for (var i = 0; i < tabs.length; i++) {
            var tabWidthTemp = (tabbarwidth - addbtn.offsetWidth - 2) / tabs.length;
            if (tabWidthTemp > this.maxTabWidth) {
                tabWidthTemp = this.maxTabWidth;
            }
            this.actualTabWidth = tabWidthTemp;
        }
        if (typeof(callback) === 'function') {
            callback(tabWidthTemp);
        }
    }
    /*
    * calculates and sets positions for tabs
    * @param1 {Boolean} animateTabs
    * @param1 {Boolean} animateAddButton
    */
    calcPositions = (animateTabs = false, animateAddButton = false) => {
        var tabCountTemp = 0,
            addbtn = this.refs.addbtn,
            lefts = [],
            a = 0;

        for (var i = 0; i < tabs.length; i++) {
            lefts.push(a);
            a += tabs[i].offsetWidth;
        }

        for (var i = 0; i < tabs.length; i++) {
            tabs[i].locked = false;
            if (animateTabs) {
                TweenMax.to(tabs[i].refs.tab, tabsAnimationDuration, {css:{left: lefts[i]}, ease: tabsAnimationEasing});
            } else {
                tabs[i].refs.tab.style.left = lefts[i] + 'px';
            }
            tabCountTemp += 1;
        }
        if (animateAddButton) {
            TweenMax.to(addbtn, tabsAnimationDuration, {css:{left: a}, ease: tabsAnimationEasing});
        } else {
            addbtn.style.left = a + 'px';
        }
    }
    /*
    * replaces tabs
    * @param1 {Number} firstIndex
    * @param2 {Number} secondIndex
    * @param3 {Tab} firstTab
    * @param4 {Tab} secondTab
    */
    replaceTabs = (firstIndex, secondIndex, firstTab, secondTab) => {
        tabs[firstIndex] = secondTab;
        tabs[secondIndex] = firstTab;
        this.changePos(secondTab);
    }
    /*
    * changes position of tab to its place
    * @param1 {Tab} callingTab
    */
    changePos = (callingTab) => {
        callingTab.locked = true;
        var t = this,
            a = 0;
        for (var i = 0; i < tabs.indexOf(callingTab); i++) {
            a += tabs[i].refs.tab.offsetWidth;
        }

        TweenMax.to(callingTab.refs.tab, tabsAnimationDuration + 0.05, {css:{left: a}, ease: tabsAnimationEasing, onComplete: function() {
            callingTab.locked = false;
        }});
    }
    /*
    * returns this
    * @return {Tabbar}
    */
    getTabBar = () => {
        return this;
    }
    render() {
        var t = this;
        return (
            <div ref="tabBarContainer" className="tabBarContainer">
                <div ref='tabbar' className="tabBar">

                    {this.props.getApp().state.tabsToCreate.map(function(object, i) {
                        return <Tab getApp={t.props.getApp} getTabBar={t.getTabBar} page={object} key={i}></Tab>;
                    })}
                    <div ref='addbtn' onClick={this.onClickAddTab} className="addBtn">
                        <div className="addbtn-icon"></div>
                        <div className="border-horizontal" style={{left: 0, opacity: 0.2}}></div>
                    </div>

                </div>
            </div>
        );
    }
}
