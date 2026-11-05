
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const limitarLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    erro: "Muitas tentativas. Aguarde 15 minutos."
  }
});

router.post("/login", limitarLogin, async (req, res) => {
  try {
    const { senha } = req.body || {};

    if (typeof senha !== "string" || !senha) {
      return res.status(400).json({
        erro: "Informe a senha administrativa."
      });
    }

    if (!process.env.ADMIN_PASSWORD_HASH || !process.env.JWT_SECRET) {
      console.error("Autenticação administrativa não configurada.");
      return res.status(503).json({
        erro: "Login temporariamente indisponível."
      });
    }

    const senhaValida = await bcrypt.compare(
      senha,
      process.env.ADMIN_PASSWORD_HASH
    );

    if (!senhaValida) {
      return res.status(401).json({
        erro: "Senha inválida."
      });
    }

    const token = jwt.sign(
      { tipo: "admin" },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "2h"
      }
    );

    return res.json({
      mensagem: "Login realizado com sucesso!",
      token
    });

  } catch (erro) {
    console.error("Erro no login:", erro.message);

    return res.status(500).json({
      erro: "Não foi possível realizar o login."
    });
  }
});

module.exports = router;
