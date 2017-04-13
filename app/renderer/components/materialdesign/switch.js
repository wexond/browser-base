'use babel';
import React from 'react';
import {TweenMax, CSSPlugin} from 'gsap';

export default class Switch extends React.Component {
    constructor() {
        super();
        //binds
        this.onClick = this.onClick.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        //global properties
        this.toggled = false;
        this.state = {
            trackOnColor: {
                color: '#2196F3',
                opacity: 0.5
            },
            trackOffColor: {
                color: '#000',
                opacity: 0.38
            },
            thumbOnColor: '#2196F3',
            thumbOffColor: '#FAFAFA'
        }
    }
    componentDidMount() {
        var t = this;
        this.setState({
            trackOnColor: (t.props.trackOnColor == null)
                ? {
                    color: '#2196F3',
                    opacity: 0.5
                }
                : t.props.trackOnColor,
            trackOffColor: (t.props.trackOffColor == null)
                ? {
                    color: '#000',
                    opacity: 0.38
                }
                : t.props.trackOffColor,
            thumbOnColor: (t.props.thumbOnColor == null)
                ? '#2196F3'
                : t.props.thumbOnColor,
            thumbOffColor: (t.props.thumbOffColor == null)
                ? '#FAFAFA'
                : t.props.thumbOffColor
        });
    }
    onClick() {
        if (!this.toggled) {
            TweenMax.to(this.refs.thumb, 0.2, {
                css: {
                    left: 27,
                    backgroundColor: this.state.thumbOnColor
                }
            });
            TweenMax.to(this.refs.track, 0.2, {
                css: {
                    backgroundColor: this.state.trackOnColor.color,
                    opacity: this.state.trackOnColor.opacity
                }
            });
            this.toggled = true;
        } else {
            TweenMax.to(this.refs.thumb, 0.2, {
                css: {
                    left: 0,
                    backgroundColor: this.state.thumbOffColor
                }
            });
            TweenMax.to(this.refs.track, 0.2, {
                css: {
                    backgroundColor: this.state.trackOffColor.color,
                    opacity: this.state.trackOffColor.opacity
                }
            });
            this.toggled = false;
        }
    }
    onMouseDown() {
        if (!this.toggled) {
            var s = this.refs.switch;
            var ripple = Ripple.createRipple(this.refs.thumb, {
                backgroundColor: '#212121',
                opacity: 0.2
            }, createRippleCenter(this.refs.thumb), s);

            Ripple.makeRipple(ripple);
        } else {
            var s = this.refs.switch;
            var ripple = Ripple.createRipple(this.refs.thumb, {
                backgroundColor: this.state.thumbOnColor,
                opacity: 0.2
            }, createRippleCenter(this.refs.thumb), s);
            Ripple.makeRipple(ripple);
        }
    }
    render() {
        return (
            <div ref="switch" className="switch" onMouseDown={this.onMouseDown} onClick={this.onClick} style={this.props.style}>
                <div ref="track" className="track"></div>
                <div ref="thumb" className="thumb"></div>
            </div>
        );
    }
}
