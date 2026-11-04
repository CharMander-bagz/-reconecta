
const pool = require("../config/db");

async function listarEquipamentos() {
  const resultado = await pool.query(
    `SELECT * FROM equipamentos ORDER BY id DESC`
  );

  return resultado.rows;
}

async function cadastrarEquipamento(dados) {
  const {
    codigo,
    nome,
    tipo,
    marca,
    modelo,
    descricao,
    estado
  } = dados;

  const resultado = await pool.query(
    `INSERT INTO equipamentos
      (codigo, nome, tipo, marca, modelo, descricao, estado)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      codigo,
      nome,
      tipo,
      marca || null,
      modelo || null,
      descricao || null,
      estado || "pendente"
    ]
  );

  return resultado.rows[0];
}

// ===== ATUALIZAÇÃO DO ESTADO DO EQUIPAMENTO =====

// Atualiza a avaliação e retira da doação equipamentos incompatíveis
async function atualizarEstado(id, estado) {
  const resultado = await pool.query(
    `UPDATE equipamentos
     SET estado = $1,
         situacao = CASE
           WHEN $2 = TRUE
                AND situacao = 'disponivel_doacao'
           THEN 'em_avaliacao'
           ELSE situacao
         END,
         atualizado_em = NOW()
     WHERE id = $3
     RETURNING *`,
    [
      estado,
      estado === "pendente" || estado === "irrecuperavel",
      id
    ]
  );

  return resultado.rows[0];
}


/* ===== DISPONIBILIZAÇÃO PARA DOAÇÃO ===== */

// Disponibiliza um equipamento somente se ele estiver funcional
async function disponibilizarParaDoacao(id) {
  const resultado = await pool.query(
    `UPDATE equipamentos
     SET situacao = 'disponivel_doacao',
         atualizado_em = NOW()
     WHERE id = $1
       AND estado = 'funcional'
       AND situacao IS DISTINCT FROM 'disponivel_doacao'
     RETURNING *`,
    [id]
  );

  // Retorna o equipamento quando a atualização é realizada
  if (resultado.rows.length > 0) {
    return resultado.rows[0];
  }

  // Verifica por que o equipamento não pôde ser atualizado
  const consulta = await pool.query(
    `SELECT id, estado, situacao
     FROM equipamentos
     WHERE id = $1`,
    [id]
  );

  const equipamento = consulta.rows[0];

  if (!equipamento) {
    return null;
  }

  // Impede a disponibilização de equipamentos não funcionais
  if (equipamento.estado !== "funcional") {
    const erro = new Error(
      "O equipamento precisa estar funcional."
    );

    erro.code = "ESTADO_INVALIDO";
    throw erro;
  }

  // Evita disponibilizar novamente um equipamento já publicado
  if (equipamento.situacao === "disponivel_doacao") {
    const erro = new Error(
      "O equipamento já está disponível para doação."
    );

    erro.code = "JA_DISPONIVEL";
    throw erro;
  }

  return null;
}




module.exports = {
  listarEquipamentos,
  cadastrarEquipamento,
  atualizarEstado,
  disponibilizarParaDoacao
};
