'use babel';
import React from 'react';
import Item from './item.js';
import Card from '../materialdesign/card.js';

export default class HistoryCard extends React.Component {
    constructor() {
        super();
        //binds
        this.addItem = this.addItem.bind(this);
        //global properties
        this.state = {
            items: [],
            itemsCount: 0,
            render: true
        }
    }
    componentDidMount() {
        var h = getHistoryData();
        h.history = h.history.reverse();
        for (var z = 0; z < h.history.length; z++) {
            if (this.props.object.title == h.history[z].date) {
                var timeObj = new Date();
                timeObj.setHours(h.history[z].time.split(":")[0], h.history[z].time.split(":")[1], 0, 0);
                var time1 = timeObj.toString();
                var timeString = time1.split(" ")[4].split(":")[0] + ":" + time1.split(" ")[4].split(":")[1];
                if (this.props.object.search != "") {
                    if (h.history[z].title.toLowerCase().indexOf(this.props.object.search.toLowerCase()) !== -1) {
                        this.addItem({title: h.history[z].title, time: timeString, id: h.history[z].id});
                    }
                } else {
                    this.addItem({title: h.history[z].title, time: timeString, id: h.history[z].id});
                }
            }
        }
    }
    /*
    * adds item to render queue
    * @param1 {Object} object
    */
    addItem(object) {
        this.setState((p)=> {
            var items = p.items;
            p.items.push(object);
            return {
                items: items,
                itemsCount: p.itemsCount + 1
            };
        });
    }
    /*
    * gets HistoryCard
    * @return {HistoryCard}
    */
    getHistoryCard = () => {
        return this;
    }

    render() {
        if (this.state.itemsCount > 0 && this.state.render) {
            return (
                <div style={this.props.style}>
                    <Card header={this.props.object.title} className="history-card">
                        {this.state.items.map((object, key) =>
                            <Item
                                ref={(r)=> this.props.getHistory().items.push(r)}
                                getParent={this.getHistoryCard}
                                object={object}
                                key={key}
                                getHistory={this.props.getHistory}>
                            </Item>
                        )}
                    </Card>
                </div>
            );
        } else {
            return null;
        }
    }
}
