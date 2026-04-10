// This file mounts the React frontend for the SWE 645 student survey application.
// It renders the main App component into the Vite root element.
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
