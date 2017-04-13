'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import Page from './page.js';
import Titlebar from './titlebar.js';
require('../../public/global/js/main.js');

export default class App extends React.Component {
    constructor() {
        super();
        //global properties
        this.defaultURL = 'wexond://newtab/';
        this.defaultOptions = {
            url: this.defaultURL,
            select: true
        };
        this.state = {
            pagesToCreate: [],
            tabsToCreate: []
        };
        this.pages = [];
    }
    /*
    lifecycle
    */
    componentDidMount() {
        var _args = remote.getGlobal('start').args;
        for (var i = 0; i < _args.length; i++) {
            _args[i] = _args[i].replace(/\\/g, "/");
            try {
                var isdir = fs.lstatSync(_args[i]).isFile();
                if (isdir) {
                    //get file type
                    var _type = _args[i].split('.').pop();
                    if (_type != "exe") {
                        if (_args[i] != "build/main.bundle.js") {
                            if (_args[i] != null || _args[i] != undefined) {
                                remote.getGlobal('start').file = _args[i];
                            }
                        }
                    }
                }
            } catch (err) {}
        }
        var t = this;
        var _url = this.defaultURL;
        if (remote.getGlobal('start').file != false) {
            _url = "file:///" + remote.getGlobal('start').file;
        }
        this.addPage({url: _url, select: true});
        document.addEventListener('keyup', function(e) {
            //CTRL + T
            if (e.ctrlKey && e.keyCode == 84) {
                t.addPage();
            }
        }, false);

    }
    /*
    * adds tab to render queue
    * @param1 {Function} getPage
    */
    addTab = (getPage) => {
        this.setState((p) => {
            p.tabsToCreate.push(getPage);
            return {tabsToCreate: p.tabsToCreate};
        });
    }
    /*
    * adds page to render queue
    * @param1 {Object} options
    */
    addPage = (options = this.defaultOptions) => {
        this.setState((p) => {
            p.pagesToCreate.push(options);
            return {pagesToCreate: p.pagesToCreate};
        });
    }
    /*
    * returns this
    * @return {Object}
    */
    getApp = () => {
        return this;
    }
    /*
    * returns titlebar
    * @return {Object}
    */
    getTitlebar = () => {
        return this.refs.titlebar;
    }
    /*
    * returns array of tabs to create
    * @return {Object[]}
    */
    getTabsToCreate = () => {
        return this.state.tabsToCreate;
    }

    render() {
        var t = this;
        this.pages = [];
        return (
            <div>
                <Titlebar getApp={this.getApp} ref="titlebar"></Titlebar>

                {this.state.pagesToCreate.map(function(object, i) {
                    return <Page ref={(s) => t.pages.push(s)} index={i} getApp={t.getApp} key={i} select={object.select} url={object.url}></Page>;
                })}
            </div>
        );
    }
}
