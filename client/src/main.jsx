import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import DashboardProvider from "./context/DashboardContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <DashboardProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DashboardProvider>
    </AuthProvider>
  </StrictMode>
);
