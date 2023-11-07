import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CampContextProvider } from "./context/CampContext.tsx";
import { UserContextProvider } from "./context/UserContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserContextProvider>
      <CampContextProvider>
        <App />
      </CampContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
