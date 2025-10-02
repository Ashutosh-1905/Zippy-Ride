import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext";
import CaptainContext from "./context/CaptainContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CaptainContext>
    <UserContext>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserContext>
  </CaptainContext>
);
