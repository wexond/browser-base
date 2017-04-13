'use babel';
import React from 'react';
import {TweenMax, CSSPlugin} from 'gsap';
import FlatButton from './flatbutton.js';

export default class Dialog extends React.Component {
    constructor() {
        super();
        //binds
        this.ripple = this.ripple.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        //global properties
        this.active = false;
    }

    componentDidMount() {

    }
    ripple(element, color, e) {
        var ripple = Ripple.createRipple(element, {
            backgroundColor: color
        }, createRippleMouse(element, e));
        Ripple.makeRipple(ripple);
    }
    show() {
        if (!this.active) {
            this.refs.dark.style.display = 'block';
            TweenMax.to(this.refs.dark, this.props.showAnimationTime, {
                css: {
                    opacity: 0.7
                }
            });
            this.refs.dialog.style.display = 'block';
            TweenMax.to(this.refs.dialog, this.props.showAnimationTime, {
                css: {
                    opacity: 1,
                    marginTop: 0
                }
            });
            this.active = true;
        }
    }
    hide() {
        var t = this;
        if (this.active) {
            TweenMax.to(this.refs.dark, this.props.hideAnimationTime, {
                css: {
                    opacity: 0
                },
                onComplete: function() {
                    t.refs.dark.style.display = 'none';
                }
            });
            this.refs.dialog.style.display = 'block';
            TweenMax.to(this.refs.dialog, this.props.hideAnimationTime, {
                css: {
                    opacity: 0,
                    marginTop: "-60px"
                },
                onComplete: function() {
                    t.refs.dialog.style.display = 'none';
                }
            });
            this.active = false;
        }
    }
    render() {
        return (
            <div>
                <div className="dialog-dark" ref="dark" onClick={this.hide}></div>
                <div className="dialog" ref="dialog">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

class DialogContent extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {

    }
    render() {
        return (
            <div className="dialog-content dialog-padding">
                {this.props.children}
            </div>
        );
    }
}

class DialogTitle extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {

    }
    render() {
        return (
            <div className="dialog-title dialog-padding no-select">
                {this.props.children}
            </div>
        );
    }
}

class DialogActions extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {

    }
    render() {
        var isActionsList = (this.props.actionsList == false) ? " dialog-padding" : " dialog-actions-list";
        return (
            <div className={"dialog-actions" + isActionsList} ref="actions_list">
                {this.props.children}
            </div>
        );
    }
}

class DialogActionButton extends React.Component {
    constructor() {
        super();
        //binds

        //global properties
    }

    componentDidMount() {

    }
    render() {
        return (
            <FlatButton className="dialog-action-button" color={this.props.color} backgroundColor={this.props.backgroundColor} rippleColor={this.props.rippleColor}>{this.props.children}</FlatButton>
        );
    }
}

DialogActionButton.defaultProps = {
    color: '#03A9F4',
    backgroundColor: 'transparent',
    rippleColor: '#03A9F4'
};

Dialog.defaultProps = {
    showAnimationTime: 0.3,
    hideAnimationTime: 0.2
};

DialogActions.defaultProps = {
    actionsList: false
}

export {Dialog, DialogContent, DialogActions, DialogTitle, DialogActionButton};
