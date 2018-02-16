import React from 'react'

import { Button, Snackbar } from 'react-toolbox';
import theme from './style.css';

class Snackbar extends React.Component {
    handleClick = () => {
        this.refs.snackbar.show();
    };

    handleSnackbarClick = () => {
        this.refs.snackbar.hide();
    };

    render() {
        return (
            <section>
                <Button 
                label='Clear History'
                 raised primary onClick={this.handleClick}
                 className='clearBtn'
                 theme={clearBtn}
                 />
                <Snackbar
                className='snackBar'
                    action='Dismiss'
                    active={this.state.active}
                    label='History Cleared Successfuly'
                    timeout={4000}
                    onClick={this.handleSnackbarClick}
                    onTimeout={this.handleSnackbarTimeout}
                    type='cancel'
                />
            </section>
        );
    }
}
return <SnackbarTest />;
