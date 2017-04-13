'use babel';
import React from 'react';
import TabBar from './tabbar.js';
import Colors from '../../../classes/colors.js';

export default class Titlebar extends React.Component {
    constructor() {
        super();
        //global properties
        this.foreground = '#fff';
        this.state = {
            closeStyle: {
                backgroundImage: 'url(browser/img/controls/close.png)'
            },
            maximizeStyle: {
                backgroundImage: 'url(browser/img/controls/maximize.png)'
            },
            minimizeStyle: {
                backgroundImage: 'url(browser/img/controls/minimize.png)'
            },
            backgroundColor: '',
            visible: true
        };
    }
    componentDidMount() {}
    /*
    * closes window
    */
    close() {
        remote.getCurrentWindow().close();
    }
    /*
    * maximizes / restores window
    */
    maximizeOrRestore() {
        if (remote.getCurrentWindow().isMaximized()) {
            //restore window
            remote.getCurrentWindow().unmaximize();
        } else {
            //maximize window
            remote.getCurrentWindow().maximize();
        }
    }
    /*
    * minimizes / restores window
    */
    minimizeOrRestore() {
        if (remote.getCurrentWindow().isMinimized()) {
            //restore window
            remote.getCurrentWindow().restore();
        } else {
            //minimize window
            remote.getCurrentWindow().minimize();
        }
    }
    /*
    * sets titlebar background color
    * @param1 {String} color
    */
    setBackground = (color) => {
        this.setState({backgroundColor: color});
        this.setForeground(Colors.getForegroundColor(color));
    }
    /*
    * sets titlebar foreground color
    * @param1 {String} color
    */
    setForeground = (color) => {
        this.foreground = color;
        for (var i = 0; i < tabs.length; i++) {
            if (!tabs[i].selected)
                tabs[i].setForeground(color, true);
            }
        this.refs.tabbar.refs.tabbar.css('color', color);

        var bottomBorders = this.refs.tabbar.refs.tabbar.getElementsByClassName('border-bottom'),
            horizontalBorders = this.refs.tabbar.refs.tabbar.getElementsByClassName('border-horizontal'),
            closeBtns = this.refs.tabbar.refs.tabbar.getElementsByClassName('closeBtn'),
            addBtns = this.refs.tabbar.refs.tabbar.getElementsByClassName('addBtn'),
            controls = this.refs.titlebar.getElementsByClassName('control');

        for (var i = 0; i < horizontalBorders.length; i++) {
            var node = horizontalBorders[i];
            if (node) {
                node.css('background-color', color);
            }
        }
        if (color == 'white')
            horizontalBorders[horizontalBorders.length - 1].css('background-color', 'black');

        for (var i = 0; i < bottomBorders.length; i++) {
            var node = bottomBorders[i];
            if (node) {
                node.css('background-color', color);
            }
        }

        if (color == "white") {
            for (var i = 0; i < closeBtns.length; i++) {
                var node = closeBtns[i];
                if (node) {
                    node.addClass('white-icon');
                }
            }
            for (var i = 0; i < addBtns.length; i++) {
                var node = addBtns[i];
                if (node) {
                    node.addClass('white-icon');
                }
            }
            for (var i = 0; i < controls.length; i++) {
                var node = controls[i];
                if (node) {
                    node.addClass('white-icon');
                }
            }
        } else if (color == "black") {
            for (var i = 0; i < closeBtns.length; i++) {
                var node = closeBtns[i];
                if (node) {
                    node.removeClass('white-icon');
                }
            }
            for (var i = 0; i < addBtns.length; i++) {
                var node = addBtns[i];
                if (node) {
                    node.removeClass('white-icon');
                }
            }
            for (var i = 0; i < controls.length; i++) {
                var node = controls[i];
                if (node) {
                    node.removeClass('white-icon');
                }
            }
        }
    }
    /*
    * sets titlebar visible
    * @param1 {boolean} flag
    */
    setVisible = (flag) => {
        this.setState({visible: flag});
    }
    /*
    * gets titlebar visible
    * return {boolean} flag
    */
    isVisible = () => {
        return this.state.visible;
    }
    render() {
        var closeStyle = {
                backgroundImage: this.state.closeStyle.backgroundImage
            },
            maximizeStyle = {
                backgroundImage: this.state.maximizeStyle.backgroundImage
            },
            minimizeStyle = {
                backgroundImage: this.state.minimizeStyle.backgroundImage
            };
        return (
            <div>
                <div ref="titlebar" style={{backgroundColor: this.state.backgroundColor, display: (this.state.visible) ? "block" : "none"}} className="titlebar">
                    <div className="window-controls">
                        <div className="control" style={closeStyle} onClick={this.close}></div>
                        <div className="control" style={maximizeStyle} onClick={this.maximizeOrRestore}></div>
                        <div className="control" style={minimizeStyle} onClick={this.minimizeOrRestore}></div>
                    </div>
                    <TabBar getApp={this.props.getApp} ref="tabbar"></TabBar>
                    <div className="border-bottom"></div>
                </div>
            </div>
        );
    }
}
