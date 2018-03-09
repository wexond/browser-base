import React, { Component } from "react";

export default class SnackBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSnackBar: this.props.show,
      timer: this.props.timer || 4000
    };
  }

  componentWillReceiveProps(nextProps) {
    var { showSnackBar, timer } = this.state;
    if (showSnackBar !== nextProps.show) {
      this.setState({
        showSnackBar: nextProps.show,
        timer: nextProps.timer
      });

      setTimeout(() => {
        this.setState({ showSnackBar: false });
      }, timer);
    }
  }

  render() {
    const { show } = this.props;
    const { showSnackBar } = this.state;
    const snackbarStyle = {
      position: "fixed",
      left: "20px",
      bottom: "20px",
      background: "#404040",
      color: "#fff",
      padding: "14px",
      WebkitTransition: "translate 0.3s cubic-bezier(0, 0, 0.30, 1)",
      transition: "translate 0.3s cubic-bezier(0, 0, 0.30, 1)",
      fontWeight: "500",
      textTransform: "initial",
      willChange: "transform",
      whiteSpace: "nowrap",
      transform: "translateY(20px)",
      WebkitTransform: "translateY(20px)",
      boxShadow: "0 0 2px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.24)",
      fontSize: "14px",
      opacity: 0,
      borderRadius: "3px",
      display: "-webkit-box",
      display: "-ms-flexbox",
      display: "flex",
      WebkitBoxAlign: "center",
      msFlexAlign: "center",
      alignItems: "center",
      WebkitBoxPack: "justify",
      msFlexPack: "justify",
      justifyContent: "space-between",
      lineHeight: "20px"
    };

    if (showSnackBar) {
      snackbarStyle.opacity = 1;
      snackbarStyle.transform = "translateY(0)";
    }

    return (
      <div style={snackbarStyle}>
        {this.props.children}
      </div>
    );
  }
};

SnackBar.defaultProps = {
  show: "false"
};

SnackBar.propTypes = {
  show: React.PropTypes.bool.isRequired,
  timer: React.PropTypes.number
};