'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import {TweenMax, CSSPlugin, Power4} from 'gsap';

export default class Checkbox extends React.Component {
    constructor() {
        super();
        //binds
        this.onClick = this.onClick.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.check = this.check.bind(this);
        this.unCheck = this.unCheck.bind(this);
        //global properties

    }
    componentDidMount() {
        this.checked = this.props.checked;
        if (this.props.checked) {
            this.unCheck();
        } else {
            this.check();
        }
        if (this.props.onCheckedChanged != null) {
            ReactDOM.findDOMNode(this).addEventListener('checked-changed', this.props.onCheckedChanged);
        }
    }
    componentWillUnmount() {
        if (this.props.onCheckedChanged != null) {
            ReactDOM.findDOMNode(this).removeEventListener('checked-changed', this.props.onCheckedChanged);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.onCheckedChanged != null && nextProps.onCheckedChanged != this.props.onCheckedChanged) {
            if (this.props.onCheckedChanged != null) {
                ReactDOM.findDOMNode(this).removeEventListener('checked-changed', this.props.onCheckedChanged);
            }
            ReactDOM.findDOMNode(this).addEventListener('checked-changed', nextProps.onCheckedChanged);
        }
    }
    check(userInteraction = false) {
        var t = this;
        TweenMax.to(this.refs.border, 0.15, {
            css: {
                borderWidth: this.refs.checkbox.offsetWidth / 2,
                borderColor: this.props.onColor
            },
            onComplete: function() {
                t.refs.icon.classList.remove('hide');
                t.refs.icon.classList.add('cover-animation');
            }
        });

        var evt = document.createEvent('Event');
        evt.initEvent('checked-changed', true, true);
        evt.checked = true;
        evt.userInteraction = userInteraction;
        ReactDOM.findDOMNode(this).dispatchEvent(evt);

        this.checked = true;
    }
    unCheck(userInteraction = false) {
        var t = this;
        this.refs.icon.classList.remove('cover-animation');
        this.refs.icon.classList.add('hide');
        TweenMax.to(this.refs.border, 0.15, {
            css: {
                borderWidth: 2,
                borderColor: this.props.offColor
            }
        });

        var evt = document.createEvent('Event');
        evt.initEvent('checked-changed', true, true);
        evt.checked = false;
        evt.userInteraction = userInteraction;
        ReactDOM.findDOMNode(this).dispatchEvent(evt);

        this.checked = false;
    }
    /*
    events
    */
    onClick() {
        if (!this.checked) {
            this.check(true);
        } else {
            this.unCheck(true);
        }
    }
    onMouseDown() {
        var ripple = Ripple.createRipple(this.refs.checkbox, {
            backgroundColor: this.refs.border.style['border-color']
        }, createRippleCenter(this.refs.checkbox));
        Ripple.makeRipple(ripple);
    }

    render() {
        return (
            <div className={((this.props.className == null) ? "" : this.props.className) + " cb-root"} style={this.props.style}>
                <div onMouseDown={this.onMouseDown} ref="checkbox" style={this.props.style} onClick={this.onClick} className="checkbox ripple-icon">
                    <div ref="border" className="border"></div>
                    <div ref="icon" className="check-icon hide"></div>
                </div>
                <div className="text">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

Checkbox.defaultProps = {
    onColor: '#2196F3',
    offColor: '#757575',
    checked: 'false'
};
