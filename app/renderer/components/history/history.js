'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import {Toolbar, ToolbarIcon, ToolbarItem, ToolbarTitle} from '../materialdesign/toolbar.js';
import HistoryCard from './historycard.js';
import FlatButton from '../materialdesign/flatbutton.js';
import {CSSPlugin, TweenMax} from 'gsap';

export default class History extends React.Component {
    constructor() {
        super();
        //global properties
        this.toolbars = [];
        this.cards = [];
        this.items = [];
        this.state = {
            checkedItems: 0,
            className1: 'history-toolbar-show',
            className2: 'history-toolbar-hide',
            toolbarBackgroundColor: '#03A9F4',
            toolbarColor: '#000',
            cards: []
        }
    }

    componentDidMount() {
        this.toggleToolbar(1);
        this.resize();
        window.addEventListener('resize', this.resize);
        this.loadHistory();
    }
    /*
    * adjusts sizes
    */
    resize = () => {
        if (window.innerWidth > 1024 + 32) {
            this.refs.cardsContainer.classList.add('history-cards-container-center');
            this.refs.cardsContainer.classList.remove('history-cards-container-normal');
        } else {
            this.refs.cardsContainer.classList.remove('history-cards-container-center');
            this.refs.cardsContainer.classList.add('history-cards-container-normal');
        }
    }
    /*
    * shows editing toolbar or normal toolbar
    * @param1 {Number} id - the id of toolbar to show
    */
    toggleToolbar = (id) => {
        if (id == 1) {
            this.setState({className1: 'history-toolbar-show', className2: 'history-toolbar-hide', toolbarBackgroundColor: '#03A9F4', toolbarColor: '#000'});
        } else {
            this.setState({className2: 'history-toolbar-show', className1: 'history-toolbar-hide', toolbarBackgroundColor: '#1E88E5', toolbarColor: '#fff'});
        }
    }
    /*
    * delete selected items from storage and document
    */
    deleteSelected = () => {
        var t = this;
        var h = getHistoryData();
        for (var i = 0; i <= this.items.length; i++) {
            if (this.items[i] != null && this.items[i].refs.checkbox != null) {
                if (this.items[i].refs.checkbox.checked) {
                    var item = this.items[i];
                    for (var x = 0; x < h.history.length; x++) {
                        if (h.history[x].id == item.props.object.id) {
                            h.history.splice(x, 1);
                        }
                    }
                    var itemsCount = item.props.getParent().state.itemsCount;
                    item.props.getParent().setState({itemsCount: itemsCount - 1});
                    item.setState(()=> {
                        t.items.splice(i, 1);
                        return {render: false};
                    });
                }
            }
        }
        saveHistory(JSON.stringify(h));
        this.setState({checkedItems: 0});
        this.toggleToolbar(1);
    }
    /*
    * gets history
    * @return {History}
    */
    getHistory = () => {
        return this;
    }
    /*
    * loads history from storage
    * @param1 {String} search
    */
    loadHistory = (search = "") => {
        for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i] != null) {
                this.cards[i].setState({render: false});
            }
        }
        var h = getHistoryData();
        h.history = h.history.reverse();
        var headers = [];
        if (search != "") {
            this.refs.searchHint.css('display', 'none');
            for (var i = 0; i < h.history.length; i++) {
                if (h.history[i].title.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
                    if (!isInArray(h.history[i].date, headers)) {
                        console.log("siema");
                        headers.push(h.history[i].date);
                    }
                }
            }
        } else {
            this.refs.searchHint.css('display', 'block');
            for (var i = 0; i < h.history.length; i++) {
                if (!isInArray(h.history[i].date, headers)) {
                    headers.push(h.history[i].date);
                }
            }
        }
        for (var i = 0; i < headers.length; i++) {
            var newState = this.state;
            newState.cards.push({title: headers[i], search: search});
            this.setState(newState);
        }
    }

    /*
    * removes selection from all items
    */
    cancelSelection = () => {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i] != null && this.items[i].refs.checkbox != null) {
                if (this.items[i].refs.checkbox.checked) {
                    this.items[i].refs.checkbox.unCheck();
                }
            }
        }
        this.setState({checkedItems: 0});
        this.toggleToolbar(1);
    }

    render() {
        this.toolbars = [];
        this.cards = [];
        var opacity = (this.state.toolbarColor == '#fff')
            ? 1
            : 0.9;
        var inverted = (this.state.toolbarColor == '#fff')
            ? true
            : false;
        return (
            <div>
                <Toolbar backgroundColor={this.state.toolbarBackgroundColor} style={{
                    position: 'fixed',
                    zIndex: 9999,
                    top: 0
                }} ref="toolbar">
                    <div className={this.state.className1} id="t1">
                        <ToolbarTitle>History</ToolbarTitle>
                        <div className="history-toolbar-searchbox">
                            <div className="history-toolbar-searchicon invert"></div>
                            <input onInput={(e)=> this.loadHistory(e.target.value)} className="history-toolbar-input" ref="search"></input>
                            <div onClick={()=> {this.refs.search.focus();}} className="history-toolbar-search-hint text" ref="searchHint">Search</div>
                        </div>
                    </div>
                    <div className={this.state.className2} id="t2">
                        <ToolbarIcon onClick={this.cancelSelection} rippleColor={this.state.toolbarColor} inverted={inverted} image="browser/img/tabbar/close.png"></ToolbarIcon>
                        <ToolbarItem color={this.state.toolbarColor} opacity={opacity} marginLeft={16}>Selected items: {this.state.checkedItems}</ToolbarItem>
                        <ToolbarItem position="right">
                            <FlatButton onClick={this.deleteSelected} textOpacity={opacity} rippleColor={this.state.toolbarColor} color={this.state.toolbarColor}>
                                DELETE
                            </FlatButton>
                        </ToolbarItem>
                        <ToolbarItem position="right">
                            <FlatButton onClick={this.cancelSelection} textOpacity={opacity} rippleColor={this.state.toolbarColor} color={this.state.toolbarColor}>
                                CANCEL
                            </FlatButton>
                        </ToolbarItem>
                    </div>
                </Toolbar>
                <div ref="cardsContainer" className="history-cards-container">
                    {this.state.cards.map((object, key) => <HistoryCard style={{marginBottom: 16}} ref={(r)=>this.cards.push(r)} object={object} key={key} getHistory={this.getHistory}></HistoryCard>)}
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <History/>, document.getElementById('app'));
