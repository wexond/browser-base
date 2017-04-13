'use babel';
import React from 'react';
import {TweenMax, CSSPlugin} from 'gsap';

export default class Menu extends React.Component {
    constructor() {
        super();
        //binds
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        //global properties
        this.state = {
            active: false
        }
    }

    componentDidMount() {

    }
    show() {

    }
    hide() {

    }
    render() {
        return (
            <div className="menu" style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
}

Menu.defaultProps = {

};

class MenuItem extends React.Component {
    constructor() {
        super();
        //binds
        this.ripple = this.ripple.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        //global properties
    }

    componentDidMount() {

    }
    ripple(e) {
        var ripple = Ripple.createRipple(this.refs.header, {
            backgroundColor: this.props.rippleColor
        }, createRippleMouse(this.refs.header, e));
        Ripple.makeRipple(ripple);
    }
    onMouseEnter(e) {
        TweenMax.to(this.refs.header, 0.3, {
            css: {
                backgroundColor: this.props.hoverColor
            }
        });
    }
    onMouseLeave(e) {
        TweenMax.to(this.refs.header, 0.3, {
            css: {
                backgroundColor: this.props.backgroundColor
            }
        });
    }
    render() {
        var _header;
        React.Children.forEach(this.props.children, function (child) {
            if (child.type == "header") {
                _header = child.props.children;
            } else if (child.type == "submenu") {

            }
        });
        return (
            <div className="menu-item" ref="item">
                <div className="header ripple no-select" ref="header" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onMouseDown={this.ripple} style={{backgroundColor: this.props.backgroundColor, color: this.props.fontColor}}>
                    {_header}
                </div>
            </div>
        );
    }
}

MenuItem.defaultProps = {
    backgroundColor: "#fff",
    hoverColor: "#e4e4e4",
    fontColor: "#444",
    rippleColor: '#444',
};

export {Menu, MenuItem};
