
const service = require("../services/pontoColetaService");

async function listar(req, res) {
  try {
    const pontos = await service.listarPontos();
    res.json(pontos);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({
      erro: "Erro ao listar pontos de coleta."
    });
  }
}

async function cadastrar(req, res) {
  try {
    const { nome, endereco, cidade, estado } = req.body;

    if (
      typeof nome !== "string" || !nome.trim() ||
      typeof endereco !== "string" || !endereco.trim() ||
      typeof cidade !== "string" || !cidade.trim() ||
      typeof estado !== "string" ||
      !/^[A-Za-z]{2}$/.test(estado)
    ) {
      return res.status(400).json({
        erro: "Nome, endereço, cidade e UF são obrigatórios."
      });
    }

    const ponto = await service.cadastrarPonto({
      ...req.body,
      nome: nome.trim(),
      endereco: endereco.trim(),
      cidade: cidade.trim(),
      estado: estado.toUpperCase()
    });

    res.status(201).json(ponto);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({
      erro: "Erro ao cadastrar ponto de coleta."
    });
  }
}

module.exports = { listar, cadastrar };
