import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext"; // ✅ Добавлено
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider> {/* ✅ Обёртка */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
