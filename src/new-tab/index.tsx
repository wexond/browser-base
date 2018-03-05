import "../new-tab.scss";

import react from "react";
import reactDom from "react-dom";

<<<<<<< HEAD
import NewTab from "../components/NewTab";
=======
import NewTab from './components'
>>>>>>> 9b97534b2ece6de49e2edb39e81afdbf4bde2ecf

// Wait for sass load.
setTimeout(function() {
  ReactDOM.render(<NewTab />, document.getElementById("app"));
}, 1);
