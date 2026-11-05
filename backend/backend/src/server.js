
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const app = express();

const equipamentoRoutes = require("./routes/equipamentoRoutes");
const doacaoRoutes = require("./routes/doacaoRoutes");
const pontoColetaRoutes = require("./routes/pontoColetaRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API ReConecta funcionando!"
  });
});

app.get("/api/teste-banco", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT NOW() AS horario"
    );

    res.json({
      mensagem: "Banco conectado com sucesso!",
      horario: resultado.rows[0].horario
    });
  } catch (erro) {
    console.error("Erro no banco:", erro.message);

    res.status(500).json({
      erro: "Falha na conexão com o banco."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.use("/api/equipamentos", equipamentoRoutes);
app.use("/api/doacoes", doacaoRoutes);
app.use("/api/pontos-coleta", pontoColetaRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(
    `Servidor ReConecta rodando na porta ${PORT}`
  );
});