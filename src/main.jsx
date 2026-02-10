import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Find the HTML element with id="root"
const rootElement = document.getElementById("root");

// Create a React root and render the App
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
