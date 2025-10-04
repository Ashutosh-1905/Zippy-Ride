import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // To enable Tailwind
import { BrowserRouter } from "react-router-dom";
import UserProvider from "./context/UserContext.jsx";
import { CaptainProvider } from "./context/CaptainContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <CaptainProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </CaptainProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
