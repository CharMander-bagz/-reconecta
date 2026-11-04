
const doacaoService = require("../services/doacaoService");

async function listar(req, res) {
  try {
    const doacoes = await doacaoService.listarDoacoes();
    res.json(doacoes);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({
      erro: "Erro ao listar doações."
    });
  }
}

async function cadastrar(req, res) {
  try {
    const { equipamento_id, titulo } = req.body;

    if (
      !Number.isSafeInteger(Number(equipamento_id)) ||
      Number(equipamento_id) <= 0 ||
      typeof titulo !== "string" ||
      !titulo.trim()
    ) {
      return res.status(400).json({
        erro: "Equipamento e título válido são obrigatórios."
      });
    }

    const doacao = await doacaoService.cadastrarDoacao({
      equipamento_id: Number(equipamento_id),
      titulo: titulo.trim(),
      descricao_publica: req.body.descricao_publica
    });

    res.status(201).json(doacao);
  } catch (erro) {
    console.error(erro.message);

    if (erro.code === "23505") {
      return res.status(409).json({
        erro: "Esse equipamento já possui uma doação."
      });
    }

    res.status(erro.status || 500).json({
      erro: erro.status
        ? erro.message
        : "Erro ao cadastrar doação."
    });
  }
}


 // ===== REATIVAÇÃO DE DOAÇÕES =====

 // Recebe a solicitação e reativa uma publicação existente
 async function reativar(req, res) {
   try {
     const { equipamentoId } = req.params;

     // Valida o ID do equipamento
     if (
       !Number.isSafeInteger(Number(equipamentoId)) ||
       Number(equipamentoId) <= 0
     ) {
       return res.status(400).json({
         erro: "ID do equipamento inválido."
       });
     }

     // Solicita ao service a reativação da doação
     const doacao = await doacaoService.reativarDoacao(
       Number(equipamentoId)
     );

     res.json({
       mensagem: "Doação reativada com sucesso!",
       doacao
     });

   } catch (erro) {
     console.error("Erro ao reativar doação:", erro.message);

     res.status(erro.status || 500).json({
       erro: erro.status
         ? erro.message
         : "Erro ao reativar doação."
     });
   }
 }

 
 // ===== LISTAGEM ADMINISTRATIVA DE DOAÇÕES =====

 // Retorna todas as publicações para o painel administrativo
 async function listarTodas(req, res) {
   try {
     const doacoes = await doacaoService.listarTodasDoacoes();

     res.json(doacoes);

   } catch (erro) {
     console.error("Erro ao listar todas as doações:", erro.message);

     res.status(500).json({
       erro: "Não foi possível carregar as doações administrativas."
     });
   }
 }


module.exports = {
  listar,
  cadastrar,
  reativar,
  listarTodas
};