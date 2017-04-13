'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import {TweenMax, CSSPlugin} from 'gsap';

export default class Item extends React.Component {
    constructor() {
        super();
        //global properties
        this.state = {
            color: "#000",
            class: '',
            render: true
        };
    }
    componentDidMount() {
        var brightness = colorBrightness(this.props.data.backgroundColor);
        if (brightness < 125) {
            this.setState({color: '#fff', class: 'invert'});
        } else {
            this.setState({color: '#000', class: ''});
        }
        this.refs.delete.css('display', 'none');
    }
    /*
    events
    */
    onMouseEnter = () => {
      this.refs.delete.css('display', 'block');
    }

    onMouseLeave = () => {
      this.refs.delete.css('display', 'none');
    }
    /*
    * @param1 {Object} e
    */
    onMouseClick = (e) => {
        if (e.target == this.refs.root) {
            window.location.href = this.props.data.url;
        }
    }
    onClickDelete = () => {
      getBookmarkIndex(this.props.data.url, function(index) {
        delBookmark(index, function() {
        });
      });
      this.setState({render: false});
      this.props.getCards().cards.splice(this.props.getCards().cards.indexOf(this), 1);
      updateFavouriteIcons();
    }
    /*
    * makes ripple
    * @param1 {Object} e
    */
    ripple = (e) => {
      if (e.target != this.refs.delete) {
          var ripple = Ripple.createRipple(this.refs.root, {
              backgroundColor: this.state.color
          }, createRippleMouse(this.refs.root, e, 1.2));
          Ripple.makeRipple(ripple);
      }
    }
    render() {
      if (this.state.render) {
        return (
            <div ref="root" className="card-item ripple pointer" style={{
                backgroundColor: this.props.data.backgroundColor,
                color: this.state.color
            }} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onMouseDown={this.ripple} onClick={this.onMouseClick}>
                <div ref="delete" onClick={this.onClickDelete} className={"delete " + this.state.class}></div>
                <img ref="icon" className="icon noselectable" src={this.props.data.icon}/>
                <div ref="title" className="title noselectable">{this.props.data.name}</div>
            </div>
        );
      } else {
        return null;
      }

    }
}
