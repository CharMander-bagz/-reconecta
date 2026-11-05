
const jwt = require("jsonwebtoken");

// Verifica se a requisição possui um token válido
function verificarAdmin(req, res, next) {
  const autorizacao = req.headers.authorization;

  if (!autorizacao || !autorizacao.startsWith("Bearer ")) {
    return res.status(401).json({
      erro: "Acesso negado. Faça login como administrador."
    });
  }

  const token = autorizacao.slice(7);

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"]
    });

    if (dados.tipo !== "admin") {
      return res.status(403).json({
        erro: "Você não possui permissão administrativa."
      });
    }

    req.admin = dados;
    next();
  } catch (erro) {
    return res.status(401).json({
      erro: "Sessão inválida ou expirada. Faça login novamente."
    });
  }
}

module.exports = verificarAdmin;
