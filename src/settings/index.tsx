import "../settings.scss";

import React from "react";
import ReactDOM from "react-dom";

import Settings from "./components";

// Wait for sass load.
setTimeout(function() {
  ReactDOM.render(<Settings />, document.getElementById("app"));
}, 1);
