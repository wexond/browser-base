'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import Cards from './cards.js';
import Item from './item.js';

export default class Newtab extends React.Component {
    constructor() {
        super();
        //global properties
        this.state = {
            cards: []
        };

        var _json = getBookmarksData();
        try {
            if (_json.length < 2) {
                resetBookmarksData();
            } else {
                for (var i = 0; i < _json.bookmarks.length; i++) {
                    var _item = _json.bookmarks[i];
                    _item.index = i;
                    this.state.cards.push(_item);
                }
            }
        } catch (ex) {
            console.log(ex);
            resetBookmarksData();
        }
    }
    componentDidMount() {

    }
    /*
    * gets new tab
    * @return {Newtab}
    */
    getNewtab = () => {
        return this;
    }

    render() {
        //TODO: inputs
        return (
            <div>
                <div className="bgizmage" ref="bgizmage">
                    <Cards maxInLine={4} ref="cards">
                        {this.state.cards.map((value, _index) => <Item data={value} key={_index}></Item>)}
                    </Cards>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Newtab/>, document.getElementById('app'));
