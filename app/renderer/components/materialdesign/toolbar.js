'use babel';
import React from 'react';

export default class Toolbar extends React.Component {
    constructor() {
        super();
        //binds

        //global properties
    }

    componentDidMount() {

    }

    render() {
        var style = this.props.style;
        if (style == null) {
            style = {

            };
        }
        style.height = this.props.height;
        style.backgroundColor = this.props.backgroundColor;
        return (
            <div ref="toolbar" className="toolbar no-select" style={style}>
                <div className="toolbar-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

class ToolbarIcon extends React.Component {
    constructor() {
        super();
        //binds
        this.onMouseDown = this.onMouseDown.bind(this);
        //global properties

    }
    componentDidMount() {}
    onMouseDown() {
        var ripple = Ripple.createRipple(this.refs.toolbarIcon, {
            backgroundColor: this.props.rippleColor
        }, createRippleCenter(this.refs.toolbarIcon, 14));
        Ripple.makeRipple(ripple);
    }
    render() {
        var iconClassName = ((this.props.position == 'left') ? 'toolbar-left' : 'toolbar-right') + " toolbar-item toolbar-icon pointer",
            imageClassName = ((this.props.inverted) ? 'invert' : '') + " toolbar-image";

        return (
            <div ref="toolbarIcon" onClick={this.props.onClick} onMouseDown={this.onMouseDown} className={iconClassName}>
                <div className={imageClassName} style={{
                    backgroundImage: 'url(' + this.props.image + ')',
                    opacity: this.props.opacity
                }}></div>
            </div>
        );
    }
}

class ToolbarItem extends React.Component {
    constructor() {
        super();
        //binds

        //global properties
    }
    componentDidMount() {
    }
    render() {
        var isLeftOrRight = ((this.props.position == 'left') ? 'toolbar-left' : 'toolbar-right'),
            isInverted = ((this.props.inverted == false) ? '' : 'inverted'),
            className = isLeftOrRight + " toolbar-item " + isInverted;
        return (
            <div className={className} style={
                {
                    color: this.props.color,
                    opacity: this.props.opacity
                }}>
                {this.props.children}
            </div>
        );
    }
}

class ToolbarTitle extends React.Component {
    constructor() {
        super();
        //binds

        //global properties

    }
    componentDidMount() {}
    render() {
        return (
            <div className='toolbar-title toolbar-left toolbar-item' style={{
                color: this.props.color,
                fontSize: this.props.fontSize,
                fontFamily: this.props.fontFamily,
                opacity: this.props.opacity,
                fontWeight: this.props.fontWeight
            }}>
                {this.props.children}
            </div>
        );
    }
}

ToolbarTitle.defaultProps = {
    color: '#000',
    fontSize: 20,
    fontFamily: 'Roboto',
    opacity: 0.8,
    fontWeight: 'bold'
};

ToolbarItem.defaultProps = {
    position: 'left',
    color: '#000',
    opacity: 0.9,
    inverted: false
};


ToolbarIcon.defaultProps = {
    inverted: false,
    position: 'left',
    rippleColor: '#212121',
    opacity: 0.7
};

Toolbar.defaultProps = {
    height: 56,
    backgroundColor: '#03A9F4'
};

export {ToolbarIcon, ToolbarItem, Toolbar, ToolbarTitle};
