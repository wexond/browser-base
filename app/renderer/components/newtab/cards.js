'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

export default class Cards extends React.Component {
    constructor() {
        super();
        //global properties
        this.cards = [];
    }
    componentDidMount() {

    }
    /*
    * gets cards
    * @return {Cards}
    */
    getCards = () => {
        return this;
    }
    render() {
        var t = this;
        return (
            <div ref="cards" className="cards">
                {this.props.children.map((child, index) => React.cloneElement(child, {
                    ref: (ref) => {
                        if (child.type.name == "Item") {
                            this.cards[index] = ref;
                        }
                    },
                    getCards: t.getCards
                }))}
            </div>
        );
    }
}
