
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./index.css";
import App from "./App.tsx";

//ADD THIS (AuthProvider)
import { AuthProvider } from "./components/Auth/AuthContext";
import { PermissionProvider } from "./components/PermissionContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PermissionProvider>
        <App />
        </PermissionProvider>
      </AuthProvider>
     
    </BrowserRouter>
  </StrictMode>
);

 
