import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CampContextProvider } from "./context/CampContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CampContextProvider>
      <App />
    </CampContextProvider>
  </React.StrictMode>
);
