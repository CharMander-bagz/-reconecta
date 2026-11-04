
// ===== CONFIGURAÇÃO DA API =====

import axios from "axios";

// Cria a conexão com o backend do ReConecta
const api = axios.create({
  baseURL: "http://localhost:3000/api"
});

export default api;
