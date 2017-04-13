'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import {TweenMax, CSSPlugin} from 'gsap';

export default class TextField extends React.Component {
    constructor() {
        super();
        //binds
        this.focus = this.focus.bind(this);
        this.unFocus = this.unFocus.bind(this);
        this.setError = this.setError.bind(this);
        this.lengthController = this.lengthController.bind(this);

        //global properties
        this.state = {
            length: 0,
            errorMessage: ''
        }
        this.active = false;
        this.isError = false;
    }

    componentDidMount() {
        if (this.props.onError != null) {
            ReactDOM.findDOMNode(this).removeEventListener('error', this.props.onError);
        }
    }

    componentWillUnmount() {
        if (this.props.onError != null) {
            ReactDOM.findDOMNode(this).removeEventListener('error', this.props.onError);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.onError != null && nextProps.onError != this.props.onError) {
            if (this.props.onError != null) {
                ReactDOM.findDOMNode(this).removeEventListener('error', this.props.onError);
            }
            ReactDOM.findDOMNode(this).addEventListener('error', nextProps.onError);
        }
    }

    lengthController() {
        if (this.props.counter) {
            var _length = this.refs.input.value.length;
            this.setState({length: _length});
            if (_length > this.props.counterMax) {
                this.setError(true);
            } else {
                this.setError(false);
            }
        }
    }

    setError(iserror, msg = "") {
        var t = this;
        if (iserror) {
           this.setState(()=> {
               return {errorMessage: msg};
           });
           TweenMax.to(this.refs.hint, 0.1, {
               css: {
                   color: this.props.errorColor
               }
           });
           TweenMax.to(this.refs.focus_divider, 0.1, {
               css: {
                   backgroundColor: this.props.errorColor
               }
           });
           TweenMax.to(this.refs.counter, 0.1, {
               css: {
                   color: this.props.errorColor,
                   opacity: 1
               }
           });
           TweenMax.to(this.refs.input, 0.1, {
               css: {
                   color: this.props.errorColor
               }
           });

           var evt = document.createEvent('Event');
           evt.initEvent('error', true, true);
           ReactDOM.findDOMNode(this).dispatchEvent(evt);

           if (msg.length > 0) {
               this.refs.error_message.style.display = 'block';
               TweenMax.to(this.refs.error_message, 0.1, {
                   css: {
                       opacity: 1
                   }
               });
           }
        } else {
            if (this.active) {
                TweenMax.to(this.refs.hint, 0.1, {
                    css: {
                        color: this.props.focusedHintColor
                    }
                });
            } else {
                TweenMax.to(this.refs.hint, 0.1, {
                    css: {
                        color: this.props.hintColor
                    }
                });
            }

            TweenMax.to(this.refs.focus_divider, 0.1, {
                css: {
                    backgroundColor: this.props.focusedDividerColor
                }
            });
            TweenMax.to(this.refs.counter, 0.1, {
                css: {
                    color: this.props.counterColor,
                    opacity: this.props.counterOpacity
                }
            });
            TweenMax.to(this.refs.input, 0.1, {
                css: {
                    color: this.props.focusedHintColor
                }
            });
            if (this.state.errorMessage.length > 0) {
                TweenMax.to(this.refs.error_message, 0.1, {
                    css: {
                        opacity: 0
                    },
                    onComplete: function() {
                        t.refs.error_message.style.display = 'none';
                    }
                });
            }
        }
        this.isError = iserror;
    }

    focus() {
        if (this.refs.input.value.length < 1) {
            TweenMax.to(this.refs.hint, 0.2, {
                css: {
                    fontSize: this.props.focusedHintFontSize,
                    top: -18,
                    opacity: this.props.focusedHintOpacity
                }
            });
            if (this.isError) {
                TweenMax.to(this.refs.hint, 0.2, {
                    css: {
                        color: this.props.errorColor,
                    }
                });
            } else {
                TweenMax.to(this.refs.hint, 0.2, {
                    css: {
                        color: this.props.focusedHintColor,
                    }
                });
            }
            TweenMax.to(this.refs.focus_divider, 0.15, {
                css: {
                    width: '100%'
                }
            });
            this.active = true;
        }
    }

    unFocus() {
        if (this.refs.input.value.length < 1) {
            TweenMax.to(this.refs.hint, 0.2, {
                css: {
                    fontSize: this.props.hintFontSize,
                    top: 0,
                    color: this.props.hintColor,
                    opacity: this.props.hintOpacity
                }
            });
            TweenMax.to(this.refs.focus_divider, 0.15, {
                css: {
                    width: '0%'
                }
            });
            this.active = false;
        }
    }

    render() {
        var displayCounter = (this.props.counter == false) ? 'none' : 'block';
        return (
            <div onClick={this.props.onClick} className="material-textfield" style={this.props.style}>
                <input ref="input" onClick={this.focus} onBlur={this.unFocus} style={{fontSize: this.props.fontSize, textShadow: '0px 0px 0px ' + this.props.color, color: this.props.focusedHintColor}} onInput={this.lengthController}></input>
                <div className="hint no-select" ref="hint" style={{fontSize: this.props.hintFontSize, color: this.props.hintColor, opacity: this.props.hintOpacity, top: 0}} onClick={()=>{this.focus(); this.refs.input.focus();}}>{this.props.hint}</div>
                <div className="divider no-select" ref="divider" style={{backgroundColor: this.props.dividerColor, opacity: this.props.dividerOpacity, height: 1}}></div>
                <div className="focus_divider no-select" ref="focus_divider" style={{backgroundColor: this.props.focusedDividerColor, height: 3, bottom: -1}}></div>
                <div className="counter no-select" ref="counter" style={{display: displayCounter, color: this.props.counterColor, opacity: this.props.counterOpacity, fontSize: this.props.counterFontSize}}>
                    {this.state.length} / {this.props.counterMax}
                </div>
                <div className="error-message no-select" ref="error_message" style={{color: this.props.errorColor}}>
                    {this.state.errorMessage}
                </div>
            </div>
        );
    }
}

TextField.defaultProps = {
    fontSize: 18,
    color: '#444' ,
    errorColor: '#d50000',
    counterMax: 10,
    counterColor: "#000",
    counterOpacity: 0.4,
    counterFontSize: 14,
    counter: false,
    hint: '',
    hintFontSize: 18,
    hintColor: '#444',
    hintOpacity: 0.4,
    focusedHintFontSize: 14,
    focusedHintOpacity: 1,
    focusedHintColor: "#03a9f4",
    focusedDividerColor: "#03a9f4",
    dividerColor: '#000',
    dividerOpacity: 0.2
};
