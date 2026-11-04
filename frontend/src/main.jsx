
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Admin from "./pages/Admin.jsx";
import "./index.css";

// ===== CONTROLE DE PÁGINAS =====

// Exibe o painel administrativo quando a URL for /admin
// e mantém o site público nos demais caminhos
const paginaAtual =
  window.location.pathname === "/admin"
    ? <Admin />
    : <App />;

// ===== INICIALIZAÇÃO DO REACT =====

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {paginaAtual}
  </React.StrictMode>
);
