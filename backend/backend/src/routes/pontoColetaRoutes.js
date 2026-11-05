
const express = require("express");
const router = express.Router();

const controller = require("../controllers/pontoColetaController");
const verificarAdmin = require("../middlewares/autenticacao");

// ===== ROTA PÚBLICA =====

// Qualquer visitante pode consultar os pontos de coleta
router.get("/", controller.listar);

// ===== ROTA ADMINISTRATIVA =====

// Apenas administradores podem cadastrar pontos de coleta
router.post("/", verificarAdmin, controller.cadastrar);

module.exports = router;
