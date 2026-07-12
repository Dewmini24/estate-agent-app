import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "react-widgets/styles.css";
import "react-tabs/style/react-tabs.css";
import "./index.css";
import App from "./App.jsx";
import { FavouritesProvider } from "./context/FavouritesContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ToastProvider>
        <FavouritesProvider>
          <App />
        </FavouritesProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);