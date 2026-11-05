
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";

import "./index.css";

const caminhoAtual = window.location.pathname;

const token = sessionStorage.getItem(
  "reconecta_admin_token"
);

let paginaAtual;

if (caminhoAtual === "/admin") {
  paginaAtual = token ? <Admin /> : <Login />;
} else {
  paginaAtual = <App />;
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    {paginaAtual}
  </React.StrictMode>
);
