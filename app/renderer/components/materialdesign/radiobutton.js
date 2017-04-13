'use babel';
import React from 'react';
import {TweenMax, CSSPlugin} from 'gsap';

export default class RadioButton extends React.Component {
    constructor() {
        super();
        //binds
        this.onClick = this.onClick.bind(this);
        this.unselect = this.unselect.bind(this);
        this.select = this.select.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        //global properties
        this.state = {
            onColor: '#2196F3',
            offColor: '#757575'
        }
        this.selected = false;
    }

    componentDidMount() {
        var t = this;
        this.props.getParent().radiobuttons.push(this);
        this.setState({
            onColor: (t.props.onColor == null) ? '#2196F3' : t.props.onColor,
            offColor: (t.props.offColor == null) ? '#757575' : t.props.offColor
        });
    }

    onClick() {
        this.props.getParent().uncheckOthers();
        this.select();
    }
    onMouseDown() {
        if (!this.selected) {
            var ripple = Ripple.createRipple(this.refs.radiobutton, null, createRippleCenter(this.refs.radiobutton));
            Ripple.makeRipple(ripple);
        }
    }

    unselect() {
        TweenMax.to(this.refs.circle, 0.1, {css:{borderColor: this.state.offColor}});
        TweenMax.to(this.refs.border, 0.1, {css:{borderColor: this.state.offColor}});
        this.refs.circle.classList.remove('scaleUp');
        this.refs.circle.classList.add('scaleDown');
        this.selected = false;
    }

    select() {
        TweenMax.to(this.refs.circle, 0.1, {css:{borderColor: this.state.onColor}});
        TweenMax.to(this.refs.border, 0.1, {css:{borderColor: this.state.onColor}});
        this.refs.circle.classList.remove('scaleDown');
        this.refs.circle.classList.add('scaleUp');
        this.selected = true;
    }

    render() {
        return (
            <div className="rb-root">
                <div ref="radiobutton" onClick={this.onClick} onMouseDown={this.onMouseDown} className="radiobutton" style={this.props.style}>
                    <div ref="border" className="border">
                        <div ref="circle" className="circle">
                        </div>
                    </div>
                </div>
                <div className="text">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

class RadioButtonContainer extends React.Component {
    constructor() {
        super();
        //binds
        this.getRadioButtonContainer = this.getRadioButtonContainer.bind(this);
        this.uncheckOthers = this.uncheckOthers.bind(this);

        //global properties
        this.radiobuttons = [];
    }

    componentDidMount() {
        this.uncheckOthers();
        this.radiobuttons[0].select();
    }

    /*
    * returns this
    */
    getRadioButtonContainer() {
        return this;
    }

    /*
    * unchecks other radiobuttons
    */
    uncheckOthers() {
        for (var i = 0; i < this.radiobuttons.length; i++) {
            this.radiobuttons[i].unselect(false);
        }
    }

    render() {
        var childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                getParent: this.getRadioButtonContainer
            })
        );
        return (
            <div>
                {childrenWithProps}
            </div>
        );
    }
}

export {RadioButton, RadioButtonContainer};
