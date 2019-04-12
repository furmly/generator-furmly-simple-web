import React from "react";
import { render } from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import App from "./containers/App";

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
// let root = document.createElement("div");

// root.id = "root";
// document.body.appendChild(root);

// Now we can render our application into it
render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
