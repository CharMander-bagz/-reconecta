
const express = require("express");
const router = express.Router();

const controller = require("../controllers/doacaoController");

router.get("/", controller.listar);
router.get("/admin/todas", controller.listarTodas);
router.post("/", controller.cadastrar);
router.patch("/equipamento/:equipamentoId/reativar",controller.reativar);


module.exports = router;
