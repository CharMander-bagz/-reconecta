
const express = require("express");
const router = express.Router();

const controller = require("../controllers/equipamentoController");

router.get("/", controller.listar);
router.post("/", controller.cadastrar);
router.patch("/:id/estado", controller.atualizarEstado);
router.patch("/:id/disponibilizar", controller.disponibilizarParaDoacao);


module.exports = router;
