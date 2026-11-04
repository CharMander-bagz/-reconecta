
const equipamentoService = require("../services/equipamentoService");

async function listar(req, res) {
  try {
    const equipamentos =
      await equipamentoService.listarEquipamentos();

    res.json(equipamentos);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({
      erro: "Erro ao listar equipamentos."
    });
  }
}

async function cadastrar(req, res) {
  try {
    const { codigo, nome, tipo } = req.body;

    if (
      typeof codigo !== "string" || !codigo.trim() ||
      typeof nome !== "string" || !nome.trim() ||
      !["impressora", "computador", "componente", "outro"]
        .includes(tipo)
    ) {
      return res.status(400).json({
        erro: "Código, nome e tipo válido são obrigatórios."
      });
    }

    const equipamento =
      await equipamentoService.cadastrarEquipamento(req.body);

    res.status(201).json(equipamento);
  } catch (erro) {
    console.error(erro.message);

    if (erro.code === "23505") {
      return res.status(409).json({
        erro: "Já existe um equipamento com esse código."
      });
    }

    if (erro.code === "23514") {
      return res.status(400).json({
        erro: "Estado ou situação inválida."
      });
    }

    res.status(500).json({
      erro: "Erro ao cadastrar equipamento."
    });
  }
}


async function atualizarEstado(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = [
      "pendente",
      "funcional",
      "reparavel",
      "irrecuperavel"
    ];

    if (!Number.isSafeInteger(Number(id)) ||
        Number(id) <= 0) {
      return res.status(400).json({
        erro: "ID inválido."
      });
    }

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        erro: "Estado inválido."
      });
    }

    const equipamento =
      await equipamentoService.atualizarEstado(id, estado);

    if (!equipamento) {
      return res.status(404).json({
        erro: "Equipamento não encontrado."
      });
    }

    res.json(equipamento);
  } catch (erro) {
    console.error(erro.message);

    res.status(500).json({
      erro: "Erro ao atualizar equipamento."
    });
  }
}


/* ===== DISPONIBILIZAÇÃO PARA DOAÇÃO ===== */

// Verifica o equipamento e solicita sua disponibilização para doação
async function disponibilizarParaDoacao(req, res) {
  try {
    const { id } = req.params;

    // Valida o identificador recebido pela rota
    if (!Number.isSafeInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        erro: "ID inválido."
      });
    }

    const equipamento =
      await equipamentoService.disponibilizarParaDoacao(id);

    if (!equipamento) {
      return res.status(404).json({
        erro: "Equipamento não encontrado."
      });
    }

    res.json({
      mensagem: "Equipamento disponibilizado para doação!",
      equipamento
    });

  } catch (erro) {
    console.error(erro.message);

    // Impede que equipamentos não funcionais sejam publicados
    if (erro.code === "ESTADO_INVALIDO") {
      return res.status(400).json({
        erro: "Somente equipamentos funcionais podem ser disponibilizados para doação."
      });
    }

    
    // Informa quando o equipamento já está disponível
    if (erro.code === "JA_DISPONIVEL") {
      return res.status(409).json({
      erro: "Este equipamento já está disponível para doação."
      });
    }


    res.status(500).json({
      erro: "Erro ao disponibilizar equipamento para doação."
    });
  }
}


module.exports = {
  listar,
  cadastrar,
  atualizarEstado,
  disponibilizarParaDoacao
};