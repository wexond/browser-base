'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import {TweenMax, CSSPlugin} from 'gsap';

export default class Find extends React.Component {
    constructor() {
        super();
        //global properties
        this.openedFind = false;
        this.state = {
            matchesString: "0 / 0",
            visibility: false
        }
    }

    componentDidMount() {

    }
    /*
    * shows/hides find panel
    * @param1 {Boolean} flag - show or hide
    */
    setVisible = (flag) => {
        var t = this;
        if (flag) {
            this.setState({visibility: true});
            TweenMax.to(this.refs.find, 0.2, {
                css:{
                    top: 10,
                    opacity: 1
                }
            });
            this.openedFind = true;
        } else {
            this.props.getPage().getWebView().stopFindInPage('clearSelection');
            TweenMax.to(this.refs.find, 0.2, {
                css:{
                    top: -20,
                    opacity: 0
                }, onComplete: function() {
                    t.setState({visibility: false});
                }
            });
            this.openedFind = false;
        }
    }
    /*
    * gets find panel visibility
    * @return {Boolean}
    */
    isOpened = () => {
        return this.openedFind;
    }
    /*
    events
    */
    onKeyPress = () => {
        var text = this.refs.text.value;
        if (text != "" ) {
            this.props.getPage().getWebView().findInPage(text);
        } else {
            this.props.getPage().getWebView().stopFindInPage('clearSelection');
            this.setMatches(0, 0);
        }

    }
    /*
    * @param1 {Object} e
    */
    onMouseDownClose = (e) => {
        var ripple = Ripple.createRipple(e.target, {
        }, createRippleCenter(e.target));
        Ripple.makeRipple(ripple);
    }
    /*
    * @param1 {String} active
    * @param2 {String} max
    */
    setMatches = (active, max) => {
        this.setState({matchesString: active + "/" + max});
    }

    render() {
        return (
            <div ref="find" className="findpanel" style={{display: (this.state.visibility) ? "block" : "none"}}>
                <input type="text" ref="text" className="textToFind" placeholder="Text to find" onKeyUp={this.onKeyPress}></input>
                <div className="matches no-select" ref="matches">{this.state.matchesString}</div>
                <div className="close ripple no-select" ref="close" onMouseDown={this.onMouseDownClose} onClick={() => this.setVisible(false)}></div>
            </div>
        );
    }
}
