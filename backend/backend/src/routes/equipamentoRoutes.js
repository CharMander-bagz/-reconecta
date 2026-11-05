
const express = require("express");
const router = express.Router();

const controller = require("../controllers/equipamentoController");
const verificarAdmin = require("../middlewares/autenticacao");

// ===== ROTA PÚBLICA =====

// Permite consultar os equipamentos
router.get("/", controller.listar);

// ===== ROTAS ADMINISTRATIVAS =====

// Cadastrar equipamentos
router.post("/", verificarAdmin, controller.cadastrar);

// Alterar o estado de conservação
router.patch(
  "/:id/estado",
  verificarAdmin,
  controller.atualizarEstado
);

// Disponibilizar equipamento para doação
router.patch(
  "/:id/disponibilizar",
  verificarAdmin,
  controller.disponibilizarParaDoacao
);

module.exports = router;
