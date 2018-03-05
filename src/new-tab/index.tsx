import "../new-tab.scss";

import react from "react";
import reactDom from "react-dom";

import NewTab from "../components/NewTab";

// Wait for sass load.
setTimeout(function() {
  ReactDOM.render(<NewTab />, document.getElementById("app"));
}, 1);
