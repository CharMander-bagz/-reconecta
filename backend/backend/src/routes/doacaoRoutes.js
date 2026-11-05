
const express = require("express");
const router = express.Router();

const controller = require("../controllers/doacaoController");
const verificarAdmin = require("../middlewares/autenticacao");

// ===== ROTA PÚBLICA =====

// Visitantes podem consultar as doações disponíveis
router.get("/", controller.listar);

// ===== ROTAS ADMINISTRATIVAS =====

// Consultar todas as doações
router.get(
  "/admin/todas",
  verificarAdmin,
  controller.listarTodas
);

// Cadastrar uma nova doação
router.post(
  "/",
  verificarAdmin,
  controller.cadastrar
);

// Reativar uma doação existente
router.patch(
  "/equipamento/:equipamentoId/reativar",
  verificarAdmin,
  controller.reativar
);

module.exports = router;
