
const pool = require("../config/db");

async function listarPontos() {
  const resultado = await pool.query(`
    SELECT id, nome, endereco, bairro, cidade,
           estado, cep, latitude, longitude,
           materiais_aceitos, horario_funcionamento,
           contato
    FROM pontos_coleta
    WHERE ativo = TRUE
    ORDER BY cidade, nome
  `);

  return resultado.rows;
}

async function cadastrarPonto(dados) {
  const {
    nome, endereco, bairro, cidade, estado,
    cep, materiais_aceitos, horario_funcionamento,
    contato
  } = dados;

  const resultado = await pool.query(
    `INSERT INTO pontos_coleta
      (nome, endereco, bairro, cidade, estado,
       cep, materiais_aceitos, horario_funcionamento,
       contato)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [
      nome, endereco, bairro || null,
      cidade, estado, cep || null,
      materiais_aceitos || null,
      horario_funcionamento || null,
      contato || null
    ]
  );

  return resultado.rows[0];
}

module.exports = { listarPontos, cadastrarPonto };
