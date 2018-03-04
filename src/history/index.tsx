import "../history.scss";

import React from "react";
import ReactDOM from "react-dom";

import History from "../components/History";

// Wait for sass load.
setTimeout(function() {
  ReactDOM.render(<History />, document.getElementById("app"));
}, 1);
