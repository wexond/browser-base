'use babel';
import React from 'react';
import {TweenMax, CSSPlugin} from 'gsap';

export default class RaisedButton extends React.Component {
    constructor() {
        super();
        //binds
        this.onMouseDown = this.onMouseDown.bind(this);

        //global properties
    }
    componentDidMount() {

    }
    onMouseDown(e) {
        var ripple = Ripple.createRipple(this.refs.button, {
            backgroundColor: this.props.rippleColor
        }, createRippleMouse(this.refs.button, e));
        Ripple.makeRipple(ripple);
    }
    render() {
        return (
            <div style={this.props.style}>
                <div className="material-button-shadow pointer" onClick={this.props.onClick} onMouseDown={this.onMouseDown} style={{opacity: this.props.opacity}}>
                    <div ref="button" className="material-button ripple" style={{backgroundColor: this.props.backgroundColor}}>
                        <div style={{color: this.props.color, opacity: this.props.textOpacity}}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

RaisedButton.defaultProps = {
    color: '#000',
    textOpacity: 0.9,
    opacity: 1,
    backgroundColor: '#03A9F4',
    rippleColor: '#000'
};
