import React from 'react';
import Snackbar from 'material-ui/Snackbar';

export default class Snackbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleClick = () => {
    this.setState({
      open: true,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    return (
      <div>
        // you can add another components here
        <Snackbar
          open={this.state.open}
          message="Write the message here"
          autoHideDuration={4000} //timeout is time ms (4000ms)
          onRequestClose={this.handleRequestClose}
          />
      </div>
    );
  }
}