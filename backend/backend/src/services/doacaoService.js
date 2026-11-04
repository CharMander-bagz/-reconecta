
const pool = require("../config/db");

async function listarDoacoes() {
  const resultado = await pool.query(`
    SELECT
      d.id,
      d.titulo,
      d.descricao_publica,
      d.status,
      d.publicado_em,
      e.codigo,
      e.nome AS equipamento,
      e.tipo,
      e.marca,
      e.modelo,
      e.estado
    FROM doacoes d
    INNER JOIN equipamentos e
      ON d.equipamento_id = e.id
    WHERE d.status = 'disponivel'
      AND e.situacao = 'disponivel_doacao'
    ORDER BY d.publicado_em DESC
  `);

  return resultado.rows;
}

async function cadastrarDoacao(dados) {
  const { equipamento_id, titulo, descricao_publica } = dados;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const equipamento = await client.query(
      `SELECT id, estado, situacao
       FROM equipamentos
       WHERE id = $1
       FOR UPDATE`,
      [equipamento_id]
    );

    if (equipamento.rows.length === 0) {
      const erro = new Error("Equipamento não encontrado.");
      erro.status = 404;
      throw erro;
    }

    const item = equipamento.rows[0];

    if (
      !["funcional", "reparavel"].includes(item.estado) ||
      item.situacao !== "em_avaliacao"
    ) {
      const erro = new Error(
        "Equipamento não está apto para doação."
      );
      erro.status = 400;
      throw erro;
    }

    const resultado = await client.query(
      `INSERT INTO doacoes
       (equipamento_id, titulo, descricao_publica)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [equipamento_id, titulo, descricao_publica || null]
    );

    await client.query(
      `UPDATE equipamentos
       SET situacao = 'disponivel_doacao',
           atualizado_em = NOW()
       WHERE id = $1`,
      [equipamento_id]
    );

    await client.query("COMMIT");
    return resultado.rows[0];

  } catch (erro) {
    await client.query("ROLLBACK");
    throw erro;
  } finally {
    client.release();
  }
}


// ===== REATIVAÇÃO DE DOAÇÃO =====

// Reativa uma publicação existente de um equipamento funcional
async function reativarDoacao(equipamentoId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Bloqueia o equipamento durante a operação
    const consultaEquipamento = await client.query(
      `SELECT id, estado, situacao
       FROM equipamentos
       WHERE id = $1
       FOR UPDATE`,
      [equipamentoId]
    );

    const equipamento = consultaEquipamento.rows[0];

    if (!equipamento) {
      const erro = new Error("Equipamento não encontrado.");
      erro.status = 404;
      throw erro;
    }

    // Somente equipamentos funcionais em avaliação podem ser publicados
    if (
      equipamento.estado !== "funcional" ||
      equipamento.situacao !== "em_avaliacao"
    ) {
      const erro = new Error(
        "O equipamento precisa estar funcional e em avaliação."
      );
      erro.status = 400;
      throw erro;
    }

    // Verifica se existe uma publicação anterior
    const consultaDoacao = await client.query(
      `SELECT id, status
       FROM doacoes
       WHERE equipamento_id = $1
       FOR UPDATE`,
      [equipamentoId]
    );

    const doacao = consultaDoacao.rows[0];

    if (!doacao) {
      const erro = new Error(
        "Este equipamento ainda não possui uma publicação."
      );
      erro.status = 404;
      throw erro;
    }

    // Não permite reativar doações reservadas ou concluídas
    if (["reservada", "concluida"].includes(doacao.status)) {
      const erro = new Error(
        "Uma doação reservada ou concluída não pode ser reativada."
      );
      erro.status = 409;
      throw erro;
    }

    // Reativa a publicação existente
    const resultado = await client.query(
      `UPDATE doacoes
       SET status = 'disponivel',
           publicado_em = NOW()
       WHERE id = $1
       RETURNING *`,
      [doacao.id]
    );

    // Disponibiliza novamente o equipamento
    await client.query(
      `UPDATE equipamentos
       SET situacao = 'disponivel_doacao',
           atualizado_em = NOW()
       WHERE id = $1`,
      [equipamentoId]
    );

    await client.query("COMMIT");

    return resultado.rows[0];

  } catch (erro) {
    await client.query("ROLLBACK");
    throw erro;

  } finally {
    client.release();
  }
}


// ===== LISTAGEM ADMINISTRATIVA DE DOAÇÕES =====

// Lista todas as publicações, incluindo as que não estão disponíveis
async function listarTodasDoacoes() {
  const resultado = await pool.query(
    `SELECT
       d.id,
       d.equipamento_id,
       d.titulo,
       d.descricao_publica,
       d.status,
       d.publicado_em,
       e.codigo,
       e.nome AS equipamento,
       e.tipo,
       e.marca,
       e.modelo,
       e.estado,
       e.situacao
     FROM doacoes d
     INNER JOIN equipamentos e
       ON d.equipamento_id = e.id
     ORDER BY d.publicado_em DESC, d.id DESC`
  );

  return resultado.rows;
}



module.exports = {
  listarDoacoes,
  cadastrarDoacao,
  reativarDoacao,
  listarTodasDoacoes
};
