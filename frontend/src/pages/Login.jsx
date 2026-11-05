
import { useState } from "react";
import api from "../services/api";

export default function Login() {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin(evento) {
    evento.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const resposta = await api.post("/auth/login", {
        senha
      });

      sessionStorage.setItem(
        "reconecta_admin_token",
        resposta.data.token
      );

      window.location.replace("/admin");
    } catch (error) {
      setErro(
        error.response?.data?.erro ||
          "Não foi possível realizar o login. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-pagina">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .login-pagina {
          min-height: 100vh;
          display: flex;
          font-family: Arial, Helvetica, sans-serif;
          background: #f8faf9;
        }

        .login-apresentacao {
          flex: 1;
          background: linear-gradient(
            145deg,
            #145c40 0%,
            #237b58 55%,
            #41316e 100%
          );
          color: white;
          padding: 65px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .login-apresentacao::after {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          right: -160px;
          bottom: -150px;
          pointer-events: none;
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .login-logo-icone {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.15);
          font-size: 30px;
        }

        .login-apresentacao-conteudo {
          max-width: 520px;
          position: relative;
          z-index: 1;
        }

        .login-etiqueta {
          display: inline-block;
          padding: 9px 15px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.08);
          font-size: 13px;
          margin-bottom: 28px;
        }

        .login-apresentacao h1 {
          font-size: clamp(36px, 4vw, 56px);
          line-height: 1.15;
          letter-spacing: -2px;
          margin: 0 0 25px;
          color: white;
        }

        .login-destaque {
          color: #b5f0c8;
        }

        .login-apresentacao-conteudo p {
          font-size: 17px;
          line-height: 1.8;
          color: #e0eee7;
          max-width: 450px;
        }

        .login-apresentacao-rodape {
          font-size: 13px;
          color: #d3e9de;
          position: relative;
          z-index: 1;
        }

        .login-area-formulario {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: #101010;
          color: #ffffff;
        }

        .login-formulario {
          width: 100%;
          max-width: 420px;
        }

        .login-icone-admin {
          width: 58px;
          height: 58px;
          background: #e9f5ee;
          border-radius: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin-bottom: 30px;
        }

        .login-formulario h2 {
          color: #172a21;
          font-size: 32px;
          letter-spacing: -1px;
          margin: 0 0 12px;
        }

        .login-descricao {
          color: #78847e;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 38px;
        }

        .login-campo-label {
          display: block;
          color: #34483d;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .login-campo {
          width: 100%;
          padding: 16px;
          border: 1px solid #dce5df;
          border-radius: 11px;
          background: white;
          font-size: 15px;
          color: #172a21;
          outline: none;
          transition: 0.2s;
        }

        .login-campo:focus {
          border-color: #28875c;
          box-shadow: 0 0 0 4px rgba(40, 135, 92, 0.1);
        }

        .login-erro {
          background: #fff0f0;
          border: 1px solid #ffd5d5;
          color: #b42318;
          padding: 13px;
          border-radius: 9px;
          font-size: 14px;
          margin-top: 16px;
        }

        .login-botao {
          width: 100%;
          margin-top: 25px;
          padding: 16px;
          background: #237b58;
          color: white;
          border: none;
          border-radius: 11px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }

        .login-botao:hover:not(:disabled) {
          background: #176342;
          transform: translateY(-1px);
        }

        .login-botao:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .login-voltar {
          display: block;
          text-align: center;
          margin-top: 28px;
          color: #64786b;
          font-size: 14px;
          text-decoration: none;
        }

        .login-voltar:hover {
          color: #237b58;
        }

        .login-seguranca {
          margin-top: 55px;
          text-align: center;
          font-size: 12px;
          color: #98a49d;
        }

        @media (max-width: 850px) {
          .login-pagina {
            flex-direction: column;
          }

          .login-apresentacao {
            padding: 30px;
            min-height: 240px;
            gap: 25px;
          }

          .login-apresentacao h1 {
            font-size: 30px;
            letter-spacing: -1px;
          }

          .login-apresentacao-conteudo p {
            font-size: 14px;
          }

          .login-etiqueta {
            margin-bottom: 15px;
          }

          .login-apresentacao-rodape {
            display: none;
          }

          .login-area-formulario {
            padding: 45px 25px;
          }

          .login-formulario h2 {
            font-size: 27px;
          }
        }


/* ===== TEMA ESCURO RECONNECTA ===== */

.login-pagina {
  background: #0b0d12;
  color: #ffffff;
}

.login-area-formulario {
  background: #0b0d12;
  color: #ffffff;
}

.login-formulario {
  background: #1c1927;
  border: 1px solid #3e2857;
  border-radius: 18px;
  padding: 38px;
}

.login-formulario h2 {
  color: #ffffff;
}

.login-descricao {
  color: #c5c0cf;
}

.login-campo-label {
  color: #e8e0f0;
}

.login-campo {
  background: #15121e;
  border: 1px solid #49305f;
  color: #ffffff;
}

.login-campo::placeholder {
  color: #91889e;
}

.login-campo:focus {
  border-color: #a855f7;
  box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.15);
}

.login-botao {
  background: #7130a0;
  color: #ffffff;
}

.login-botao:hover:not(:disabled) {
  background: #8c3fc1;
}

.login-voltar {
  color: #c5c0cf;
}

.login-voltar:hover {
  color: #c084fc;
}

.login-seguranca {
  color: #9990a5;
}

.login-icone-admin {
  background: #30203f;
  color: #c084fc;
}


      `}</style>

      {/* ===== APRESENTAÇÃO DO PROJETO ===== */}

      <section className="login-apresentacao">
        <div className="login-logo">
          <span className="login-logo-icone">♻</span>
          <span>ReConecta</span>
        </div>

        <div className="login-apresentacao-conteudo">

          <h1>
            Reconectando
            <br />
            tecnologia e
            <br />
            <span className="login-destaque">
              novas oportunidades.
            </span>
          </h1>

          <p>
            Uma plataforma dedicada ao reaproveitamento
            de equipamentos eletrônicos, incentivando
            a sustentabilidade e conectando recursos
            a quem precisa.
          </p>
        </div>

        <div className="login-apresentacao-rodape">
          © {new Date().getFullYear()} ReConecta
          {" • "}Projeto de Extensão Integrada
        </div>
      </section>

      {/* ===== FORMULÁRIO ADMINISTRATIVO ===== */}

      <section className="login-area-formulario">
        <div className="login-formulario">

          <h2>Bem-vindo de volta!</h2>

          <p className="login-descricao">
            Acesse o painel administrativo para
            gerenciar equipamentos, doações e
            pontos de coleta.
          </p>

          <form onSubmit={fazerLogin}>
            <label
              className="login-campo-label"
              htmlFor="senha-admin"
            >
              Senha
            </label>

            <input
              id="senha-admin"
              className="login-campo"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              required
            />

            {erro && (
              <div className="login-erro" role="alert">
                {erro}
              </div>
            )}

            <button
              className="login-botao"
              type="submit"
              disabled={carregando}
            >
              {carregando
                ? "Verificando acesso..."
                : "Entrar no painel →"}
            </button>
          </form>

          <a className="login-voltar" href="/">
            ← Voltar para o site
          </a>

          <div className="login-seguranca">
             Área restrita à administração
          </div>
        </div>
      </section>
    </div>
  );
}
