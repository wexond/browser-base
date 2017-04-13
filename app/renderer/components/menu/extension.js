'use babel';
import React from 'react';

export default class Extension extends React.Component {
    constructor() {
        super();
        //global properties
        this.data = null;
        this.state = {
            backgroundImage: null
        };
    }
    componentDidMount() {
        this.data = this.props.object;
        this.setState({
            backgroundImage: 'url(' + this.data.icon + ')'
        });
        var t = this;
        var menu = new Menu()
        menu.append(new MenuItem({
            label: 'Reload',
            click() {
                t.data.api.reload();
            }
        }))
        menu.append(new MenuItem({
            label: 'Open devtools',
            click() {
                t.data.api.extensionWebview.openDevTools();
            }
        }))

        this.refs.root.addEventListener('contextmenu', (e) => {
            e.preventDefault()
            menu.popup(remote.getCurrentWindow())
        }, false)
    }
    /*
    events
    */
    onMouseDown(e) {
        var ripple = Ripple.createRipple(e.target, {}, createRippleCenter(e.target, 20));
        Ripple.makeRipple(ripple);
    }

    render() {
        return (
            <div onClick={(e)=> this.props.onClick(e, this)} ref="root" onMouseDown={this.onMouseDown} className="ripple-icon extension-item pointer" style={{
                backgroundImage: this.state.backgroundImage
            }}></div>
        );
    }
}
