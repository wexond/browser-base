'use babel';
import React from 'react';
import Checkbox from '../materialdesign/checkbox.js';

export default class Item extends React.Component {
    constructor() {
        super()
        //binds
        this.checkedChanged = this.checkedChanged.bind(this);
        //global properties
        this.state = {
            render: true
        }
    }
    componentDidMount() {

    }
    componentWillUnmount() {
        this.props.getHistory().items.splice(this.props.getHistory().items.indexOf(this), 1);
    }
    /*
    events
    */
    /*
    * @param1 {Object} e
    */
    checkedChanged(e) {
        var checkedItems = this.props.getHistory().state.checkedItems;
        if (e.checked) {
            checkedItems += 1;
        } else {
            checkedItems -= 1;
        }
        this.props.getHistory().setState({checkedItems: checkedItems});
        if (checkedItems > 0) {
            this.props.getHistory().toggleToolbar(2);
        } else {
            this.props.getHistory().toggleToolbar(1);
        }
    }
    render() {
        if (this.state.render) {
            return (
                <div className="history-item-root">
                    <Checkbox ref="checkbox" onCheckedChanged={this.checkedChanged} className="history-item-checkbox"></Checkbox>
                    <div className="history-item-hour history-item">{this.props.object.time}</div>
                    <div className="history-item-title history-item">{this.props.object.title}</div>
                    <div className="history-item-domain history-item">www.facebook.com</div>
                </div>
            );
        } else {
            return null;
        }
    }
}
