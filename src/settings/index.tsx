import "../settings.scss";

import react from "react";
import reactDom from "react-dom";

import Settings from "../components/Settings";

// Wait for sass load.
setTimeout(function() {
  ReactDOM.render(<Settings />, document.getElementById("app"));
}, 1);
