import "../settings.scss";

import react from "react";
import reactDom from "react-dom";

<<<<<<< HEAD
import Settings from "../components/Settings";
=======
import Settings from './components'
>>>>>>> 9b97534b2ece6de49e2edb39e81afdbf4bde2ecf

// Wait for sass load.
setTimeout(function() {
  ReactDOM.render(<Settings />, document.getElementById("app"));
}, 1);
