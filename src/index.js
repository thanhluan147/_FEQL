import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import "react-datepicker/dist/react-datepicker.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
import "./i18n/i18n";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter basename="/">
      <App />
    </HashRouter>
  </React.StrictMode>
);
