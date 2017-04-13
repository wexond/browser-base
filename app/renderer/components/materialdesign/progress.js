'use babel';
import React from 'react';
import {TweenMax, CSSPlugin} from 'gsap';

export default class ProgressBarDeterminate extends React.Component {
    constructor() {
        super();
        //binds
        this.setPercent = this.setPercent.bind(this);
        this.setValue = this.setValue.bind(this);
        //global properties
    }

    componentDidMount() {}

    setPercent(per) {
        if (per != undefined && per != null) {
            if (per > 100) {
                per = 100;
            } else if (per < 1) {
                per = 0;
            }
            per = per + '%';
            TweenMax.to(this.refs.divider, this.props.animationTime, {
                css: {
                    width: per
                }
            });
        }
    }

    setValue(max, i) {
        if (max != undefined && max != null && i != undefined && i != null) {
            var per = (i * 100) / max;
            this.setPercent(per);
        }
    }

    render() {
        return (
            <div style={this.props.style}>
                <div className="progressbar-determinate" ref="progress" style={{
                    backgroundColor: this.props.backgroundColor
                }}>
                    <div className="divider" ref="divider" style={{
                        backgroundColor: this.props.barColor
                    }}></div>
                </div>
            </div>
        );
    }
}

ProgressBarDeterminate.defaultProps = {
    backgroundColor: "#afd1ee",
    dividerColor: "#03a9f4",
    animationTime: 0.7
};

class ProgressBarInDeterminate extends React.Component {
    constructor() {
        super();
        //binds
        this.animate = this.animate.bind(this);
        //global properties
    }

    componentDidMount() {
        this.animate();
    }

    animate() {
        var t = this;
        TweenMax.to(this.refs.divider, 2, {
            css: {
                left: '100%'
            },
            ease: Sine.easeIn,
            onComplete: function() {
                TweenMax.to(t.refs.divider_fast, 1.5, {
                    css: {
                        left: '100%',
                        width: '10%'
                    },
                    ease: Sine.easeInOut,
                    onComplete: function() {
                        t.refs.divider.style.left = "-40%";
                        t.refs.divider_fast.style.left = "-80%";
                        t.refs.divider_fast.style.width = "80%";
                        t.animate();
                    }
                });
            }
        });
    }

    render() {
        return (
            <div style={this.props.style}>
                <div className="progressbar-indeterminate" ref="progress" style={{
                    backgroundColor: this.props.backgroundColor
                }}>
                    <div className="divider" ref="divider" style={{
                        backgroundColor: this.props.barColor
                    }}></div>
                    <div className="divider-fast" ref="divider_fast" style={{
                        backgroundColor: this.props.barColor
                    }}></div>
                </div>
            </div>
        );
    }
}

ProgressBarInDeterminate.defaultProps = {
    backgroundColor: "#afd1ee",
    dividerColor: "#03a9f4"
};

class PreloaderDeterminate extends React.Component {
    constructor() {
        super();
        //binds

        //global properties
    }

    componentDidMount() {}

    render() {
        return (
            <div style={this.props.style}>
                <svg className="preloader-determinate" viewBox="25 25 50 50">
                    <circle className="path" ref="path" style={{stroke: this.props.strokeColor, strokeWidth: this.props.strokeWidth}} cx="50" cy="50" r="20" fill="none" strokeMiterlimit="10"/>
                </svg>
            </div>
        );
    }
}

PreloaderDeterminate.defaultProps = {
    strokeColor: "#03a9f4",
    strokeWidth: 5
};

class PreloaderInDeterminate extends React.Component {
    constructor() {
        super();
        //binds
        this.setPercent = this.setPercent.bind(this);
        this.setValue = this.setValue.bind(this);
        //global properties
    }

    componentDidMount() {}

    setPercent(per) {
        if (per != undefined && per != null) {
            if (per > 100) {
                per = 100;
            } else if (per < 1) {
                per = 0;
            }
            var stroke = (this.props.maxDash * per) / 100;
            TweenMax.to(this.refs.path, this.props.animationTime, {
                css: {
                    strokeDasharray: stroke
                },
                ease: this.props.ease,
                onComplete: function() {

                }
            });
        }
    }

    setValue(max, i) {
        if (max != undefined && max != null && i != undefined && i != null) {
            var per = (i * 100) / max;
            this.setPercent(per);
        }
    }

    render() {
        return (
            <div style={this.props.style}>
                <svg className="preloader-indeterminate" viewBox="25 25 50 50">
                    <circle className="path" ref="path" style={{stroke: this.props.strokeColor, strokeWidth: this.props.strokeWidth}} cx="50" cy="50" r="20" fill="none" strokeMiterlimit="10"/>
                </svg>
            </div>
        );
    }
}

PreloaderInDeterminate.defaultProps = {
    strokeColor: "#03a9f4",
    strokeWidth: 5,
    maxDash: 125,
    animationTime: 1,
    ease: Power2.easeInOut
};

export {ProgressBarDeterminate, ProgressBarInDeterminate, PreloaderDeterminate, PreloaderInDeterminate};
