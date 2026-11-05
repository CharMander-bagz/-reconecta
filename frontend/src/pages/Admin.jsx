
import { useEffect, useState } from "react";
import api from "../services/api";
import "./Admin.css";

// ===== DADOS INICIAIS DO FORMULÁRIO =====

const formularioInicial = {
  codigo: "",
  nome: "",
  tipo: "impressora",
  marca: "",
  modelo: "",
  descricao: "",
  estado: "pendente"
};

function Admin() {

  function sairDoPainel() {
  sessionStorage.removeItem("reconecta_admin_token");
  window.location.replace("/admin");
}


  // ===== NAVEGAÇÃO DO PAINEL =====

  // Controla qual seção administrativa está aberta
  const [paginaAtual, setPaginaAtual] = useState("dashboard");


  // ===== ESTADOS DO SISTEMA =====

  const [equipamentos, setEquipamentos] = useState([]);
  const [doacoes, setDoacoes] = useState([]);
  // Armazena todas as publicações para o painel administrativo
  const [todasDoacoes, setTodasDoacoes] = useState([]);
  const [pontos, setPontos] = useState([]);
  const [mostrarFormularioPonto, setMostrarFormularioPonto] = useState(false);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  // ===== ESTADOS DO CADASTRO =====

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [novoEquipamento, setNovoEquipamento] =
    useState({ ...formularioInicial });
  const [salvando, setSalvando] = useState(false);


  // ===== ESTADOS DA AVALIAÇÃO =====

  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);
  const [estadoAvaliacao, setEstadoAvaliacao] = useState("pendente");
  const [salvandoAvaliacao, setSalvandoAvaliacao] = useState(false);


  // ===== ESTADOS DA DISPONIBILIZAÇÃO =====

  const [equipamentoParaDoacao, setEquipamentoParaDoacao] = useState(null);
  const [publicandoDoacao, setPublicandoDoacao] = useState(false);
  const [erroDoacao, setErroDoacao] = useState("");

  // ===== CARREGAMENTO DOS DADOS =====

  // Busca os dados do sistema e atualiza os indicadores e a tabela
  async function carregarDados() {
    setCarregando(true);
    setErro("");

    try {

const [resEquipamentos, resDoacoes, resPontos, resTodasDoacoes] =
  await Promise.all([
    api.get("/equipamentos"),
    api.get("/doacoes"),
    api.get("/pontos-coleta"),
    api.get("/doacoes/admin/todas")
  ]);


      setEquipamentos(resEquipamentos.data);
      setDoacoes(resDoacoes.data);
      setTodasDoacoes(resTodasDoacoes.data);
      setPontos(resPontos.data);

    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os dados do sistema.");

    } finally {
      setCarregando(false);
    }
  }

  // ===== INICIALIZAÇÃO =====

  // Carrega os registros quando o painel é aberto
  useEffect(() => {
    carregarDados();
  }, []);

  // ===== FUNÇÕES DO FORMULÁRIO =====

  // Abre o formulário e prepara os campos para um novo cadastro
  function abrirFormulario() {
    setNovoEquipamento({ ...formularioInicial });
    setMensagem("");
    setErro("");
    setMostrarFormulario(true);
  }

  // Fecha o formulário sem salvar os dados
  function fecharFormulario() {
    setMostrarFormulario(false);
    setNovoEquipamento({ ...formularioInicial });
  }

  // Atualiza o campo alterado pelo usuário
  function alterarCampo(evento) {
    const { name, value } = evento.target;

    setNovoEquipamento((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  // Envia o equipamento para o backend e atualiza a tabela
  async function cadastrarEquipamento(evento) {
    evento.preventDefault();

    if (!novoEquipamento.codigo.trim() ||
        !novoEquipamento.nome.trim()) {
      setErro("Preencha o código e o nome do equipamento.");
      return;
    }

    setSalvando(true);
    setErro("");
    setMensagem("");

    try {
      await api.post("/equipamentos", {
        codigo: novoEquipamento.codigo.trim(),
        nome: novoEquipamento.nome.trim(),
        tipo: novoEquipamento.tipo,
        marca: novoEquipamento.marca.trim(),
        modelo: novoEquipamento.modelo.trim(),
        descricao: novoEquipamento.descricao.trim(),
        estado: novoEquipamento.estado
      });

      fecharFormulario();

      await carregarDados();

      setMensagem("Equipamento cadastrado com sucesso!");

    } catch (error) {
      console.error(error);

      const mensagemServidor = error.response?.data?.erro;

      setErro(
        typeof mensagemServidor === "string"
          ? mensagemServidor
          : "Não foi possível cadastrar o equipamento."
      );

    } finally {
      setSalvando(false);
    }
  }


  // ===== FUNÇÕES DE AVALIAÇÃO =====

  // Abre o pop-up com os dados do equipamento selecionado
  function abrirAvaliacao(equipamento) {
    setEquipamentoSelecionado(equipamento);
    setEstadoAvaliacao(equipamento.estado);
    setErro("");
    setMensagem("");
  }

  // Fecha o pop-up sem alterar o equipamento
  function fecharAvaliacao() {
    setEquipamentoSelecionado(null);
    setEstadoAvaliacao("pendente");
  }

  // Salva o novo estado do equipamento no banco de dados
  async function salvarAvaliacao(evento) {
    evento.preventDefault();

    if (!equipamentoSelecionado || salvandoAvaliacao) {
      return;
    }

    setSalvandoAvaliacao(true);
    setErro("");
    setMensagem("");

    try {
      await api.patch(
        `/equipamentos/${equipamentoSelecionado.id}/estado`,
        {
          estado: estadoAvaliacao
        }
      );

      fecharAvaliacao();

      await carregarDados();

      setMensagem("Avaliação atualizada com sucesso!");


    } catch (error) {
      // ===== DIAGNÓSTICO DO ERRO =====
      console.error("Erro ao avaliar equipamento:", error);
      console.error("Resposta do backend:", error.response?.data);

      const mensagemServidor =
        error.response?.data?.erro ||
        error.response?.data?.message;

      setErro(
        typeof mensagemServidor === "string"
          ? mensagemServidor
          : "Não foi possível atualizar a avaliação do equipamento."
      );


    } finally {
      setSalvandoAvaliacao(false);
    }
  }


  // ===== FUNÇÕES DE DISPONIBILIZAÇÃO =====

  // Abre o pop-up de confirmação do equipamento escolhido
  function abrirDisponibilizacao(equipamento) {
    setEquipamentoParaDoacao(equipamento);
    setErroDoacao("");
    setMensagem("");
  }

  // Fecha o pop-up sem alterar o equipamento
  function fecharDisponibilizacao() {
    setEquipamentoParaDoacao(null);
    setErroDoacao("");
  }


// ===== PUBLICAÇÃO DE EQUIPAMENTOS PARA DOAÇÃO =====

// Cria uma publicação ou reativa uma doação já cadastrada
async function disponibilizarEquipamento() {
  if (!equipamentoParaDoacao || publicandoDoacao) {
    return;
  }

  setPublicandoDoacao(true);
  setErroDoacao("");

  try {
    const equipamentoId = equipamentoParaDoacao.id;

    // Tenta cadastrar uma nova publicação
    try {
      await api.post("/doacoes", {
        equipamento_id: equipamentoId,
        titulo: equipamentoParaDoacao.nome,
        descricao_publica:
          equipamentoParaDoacao.descricao ||
          "Equipamento disponível para doação pelo ReConecta."
      });

    } catch (error) {
      // Reativa uma publicação existente quando houver conflito
      if (error.response?.status === 409) {
        await api.patch(
          `/doacoes/equipamento/${equipamentoId}/reativar`
        );
      } else {
        throw error;
      }
    }

    // Atualiza os dados após a publicação
    fecharDisponibilizacao();
    await carregarDados();

    setMensagem("Equipamento disponibilizado para doação!");

  } catch (error) {
    console.error("Erro ao publicar doação:", error);

    setErroDoacao(
      error.response?.data?.erro ||
      "Não foi possível disponibilizar o equipamento."
    );

  } finally {
    setPublicandoDoacao(false);
  }
}



  // ===== INTERFACE DO PAINEL =====

  return (
    <div className="admin">

      {/* ===== MENU LATERAL ===== */}

      <aside className="admin-menu">
        <h2>♻ ReConecta</h2>
        <p>Painel administrativo</p>

{/* ===== NAVEGAÇÃO ADMINISTRATIVA ===== */}

<nav className="admin-navegacao">
  <button
    type="button"
    className={paginaAtual === "dashboard" ? "ativo" : ""}
    onClick={() => setPaginaAtual("dashboard")}
  >
    ▦ Dashboard
  </button>

  <button
    type="button"
    className={paginaAtual === "equipamentos" ? "ativo" : ""}
    onClick={() => setPaginaAtual("equipamentos")}
  >
    ▣ Equipamentos
  </button>

  <button
    type="button"
    className={paginaAtual === "doacoes" ? "ativo" : ""}
    onClick={() => setPaginaAtual("doacoes")}
  >
    ♧ Doações
  </button>

  <button
    type="button"
    className={paginaAtual === "pontos" ? "ativo" : ""}
    onClick={() => setPaginaAtual("pontos")}
  >

    ⌖ Pontos de coleta
  </button>
</nav>

{/* ===== SAIR DO PAINEL ===== */}


<button
  type="button"
  onClick={sairDoPainel}
  style={{
    marginTop: "24px",
    padding: "12px 16px",
    width: "100%",
    borderRadius: "9px",
    border: "1px solid #513064",
    background: "#21182d",
    color: "#e6a0b8",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.2s ease"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#352044";
    e.currentTarget.style.borderColor = "#a855f7";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#21182d";
    e.currentTarget.style.borderColor = "#513064";
  }}
>
  <span>↪</span>
  Sair do painel
</button>


      </aside>


      {/* ===== CONTEÚDO PRINCIPAL ===== */}

      <main className="admin-conteudo">


{/* ===== CABEÇALHO EXCLUSIVO DO DASHBOARD ===== */}

<div
  className="admin-topo"
  style={{
    display: paginaAtual === "dashboard" ? undefined : "none"
  }}
>

          <div>

{/* ===== TÍTULO DINÂMICO DA PÁGINA ===== */}

<h1>
  {paginaAtual === "dashboard"
    ? "Visão Geral"
    : paginaAtual === "equipamentos"
    ? "Gerenciamento de Equipamentos"
    : paginaAtual === "doacoes"
    ? "Gerenciamento de Doações"
    : "Gerenciamento de Pontos de Coleta"}
</h1>

<p>
  {paginaAtual === "dashboard"
    ? "Acompanhe os principais indicadores do ReConecta."
    : paginaAtual === "equipamentos"
    ? "Cadastre e acompanhe os equipamentos recebidos."
    : paginaAtual === "doacoes"
    ? "Gerencie as publicações de equipamentos para doação."
    : "Gerencie os locais de recebimento de equipamentos."}
</p>

          </div>

          {/* ===== BOTÃO DE ATUALIZAÇÃO ===== */}

          <button
            className="admin-atualizar"
            onClick={carregarDados}
            disabled={carregando || salvando}
          >
            {carregando ? "Atualizando..." : "↻ Atualizar dados"}
          </button>
        </div>

        {/* ===== MENSAGENS DO SISTEMA ===== */}

        {erro && (
          <div className="admin-erro" role="alert">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="admin-sucesso" role="status">
            {mensagem}
          </div>
        )}

        {/* ===== INDICADORES DO SISTEMA ===== */}

       {paginaAtual === "dashboard" && (
        <section className="admin-indicadores">

          <div className="admin-card">
            {/* ===== ÍCONE E TÍTULO DO INDICADOR ===== */}

<div className="admin-card-cabecalho">
  <span className="admin-card-icone">▣</span>
  <h3>Equipamentos cadastrados</h3>
</div>
            <strong>
              {carregando ? "..." : equipamentos.length}
            </strong>
          </div>

          <div className="admin-card">
            <div className="admin-card-cabecalho">
  <span className="admin-card-icone">♻</span>
  <h3>Doações disponíveis</h3>
</div>
            <strong>
              {carregando ? "..." : doacoes.length}
            </strong>
          </div>

          <div className="admin-card">
            <div className="admin-card-cabecalho">
  <span className="admin-card-icone">⌖</span>
  <h3>Pontos de coleta</h3>
</div>
            <strong>
              {carregando ? "..." : pontos.length}
            </strong>
          </div>

        </section>
        )}

        {/* ===== GERENCIAMENTO DE EQUIPAMENTOS ===== */}

        {(paginaAtual === "dashboard" || paginaAtual === "equipamentos") && (
        <section className="admin-secao">

          <div className="admin-secao-topo">
            <div>
              <h2>
  {paginaAtual === "equipamentos"
    ? "Gerenciamento de Equipamentos"
    : "Equipamentos cadastrados"}
</h2>
<p>
  {paginaAtual === "equipamentos"
    ? "Cadastre e acompanhe os equipamentos recebidos."
    : "Acompanhe os equipamentos recebidos pelo ReConecta."}
</p>
            </div>

            <button
              className="admin-botao"
              onClick={abrirFormulario}
              disabled={salvando}
            >
              + Novo equipamento
            </button>
          </div>

          {/* ===== FORMULÁRIO DE CADASTRO ===== */}

          {/* ===== POP-UP DE CADASTRO ===== */}

        {mostrarFormulario && (
        <div
            className="admin-modal-fundo"
             onMouseDown={(evento) => {
            // Fecha o pop-up ao clicar fora do formulário
            if (evento.target === evento.currentTarget && !salvando) {
               fecharFormulario();
            }
          }}
                 >
        <form
          className="admin-formulario admin-modal"
          onSubmit={cadastrarEquipamento}
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-novo-equipamento"
        >

         {/* ===== CABEÇALHO DO POP-UP ===== */}

          <div className="admin-modal-topo">
          <h3 id="titulo-novo-equipamento">
             Cadastrar novo equipamento
          </h3>

        <button
          type="button"
          className="admin-modal-fechar"
          onClick={fecharFormulario}
          disabled={salvando}
          aria-label="Fechar formulário"
        >
          ×
        </button>
      </div>

      <div className="admin-campos">

                <div className="admin-campo">
                  <label htmlFor="codigo">Código *</label>
                  <input
                    id="codigo"
                    name="codigo"
                    value={novoEquipamento.codigo}
                    onChange={alterarCampo}
                    placeholder="Ex.: IMP-002"
                    required
                    disabled={salvando}
                  />
                </div>

                <div className="admin-campo">
                  <label htmlFor="tipo">Tipo *</label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={novoEquipamento.tipo}
                    onChange={alterarCampo}
                    disabled={salvando}
                  >
                    <option value="impressora">Impressora</option>
                    <option value="computador">Computador</option>
                    <option value="componente">Componente</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div className="admin-campo admin-campo-largo">
                  <label htmlFor="nome">Nome do equipamento *</label>
                  <input
                    id="nome"
                    name="nome"
                    value={novoEquipamento.nome}
                    onChange={alterarCampo}
                    placeholder="Ex.: Impressora Epson EcoTank"
                    required
                    disabled={salvando}
                  />
                </div>

                <div className="admin-campo">
                  <label htmlFor="marca">Marca</label>
                  <input
                    id="marca"
                    name="marca"
                    value={novoEquipamento.marca}
                    onChange={alterarCampo}
                    placeholder="Ex.: Epson"
                    disabled={salvando}
                  />
                </div>

                <div className="admin-campo">
                  <label htmlFor="modelo">Modelo</label>
                  <input
                    id="modelo"
                    name="modelo"
                    value={novoEquipamento.modelo}
                    onChange={alterarCampo}
                    placeholder="Ex.: L3250"
                    disabled={salvando}
                  />
                </div>

                <div className="admin-campo admin-campo-largo">
                  <label htmlFor="estado">Estado de conservação</label>
                  <select
                    id="estado"
                    name="estado"
                    value={novoEquipamento.estado}
                    onChange={alterarCampo}
                    disabled={salvando}
                  >
                    <option value="pendente">
                      Pendente de avaliação
                    </option>
                    <option value="funcional">Funcional</option>
                    <option value="reparavel">Reparável</option>
                    <option value="irrecuperavel">
                      Irrecuperável
                    </option>
                  </select>
                </div>

                <div className="admin-campo admin-campo-largo">
                  <label htmlFor="descricao">Descrição</label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    value={novoEquipamento.descricao}
                    onChange={alterarCampo}
                    placeholder="Informações sobre o equipamento..."
                    rows="4"
                    disabled={salvando}
                  />
                </div>

              </div>

              {/* ===== BOTÕES DO FORMULÁRIO ===== */}

              <div className="admin-formulario-botoes">
                <button
                  type="button"
                  className="admin-cancelar"
                  onClick={fecharFormulario}
                  disabled={salvando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="admin-salvar"
                  disabled={salvando}
                >
                  {salvando
                    ? "Salvando..."
                    : "Salvar equipamento"}
                </button>
              </div>
            </form>
        </div>

          )}


          {/* ===== POP-UP DE AVALIAÇÃO ===== */}

          {equipamentoSelecionado && (
            <div
              className="admin-modal-fundo"
              onMouseDown={(evento) => {
                // Fecha ao clicar fora da janela
                if (
                  evento.target === evento.currentTarget &&
                  !salvandoAvaliacao
                ) {
                  fecharAvaliacao();
                }
              }}
            >
              <form
                className="admin-formulario admin-modal"
                onSubmit={salvarAvaliacao}
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-avaliacao"
              >

                {/* ===== CABEÇALHO DA AVALIAÇÃO ===== */}

                <div className="admin-modal-topo">
                  <h3 id="titulo-avaliacao">
                    Avaliar equipamento
                  </h3>

                  <button
                    type="button"
                    className="admin-modal-fechar"
                    onClick={fecharAvaliacao}
                    disabled={salvandoAvaliacao}
                    aria-label="Fechar avaliação"
                  >
                    ×
                  </button>
                </div>

                {/* ===== DADOS DO EQUIPAMENTO ===== */}

                <div className="admin-avaliacao-info">
                  <h4>{equipamentoSelecionado.nome}</h4>

                  <p>
                    <strong>Código:</strong>{" "}
                    {equipamentoSelecionado.codigo}
                  </p>

                  <p>
                    <strong>Marca:</strong>{" "}
                    {equipamentoSelecionado.marca || "—"}
                  </p>

                  <p>
                    <strong>Modelo:</strong>{" "}
                    {equipamentoSelecionado.modelo || "—"}
                  </p>
                </div>

                {/* ===== CAMPO DE AVALIAÇÃO ===== */}

                <div className="admin-campo">
                  <label htmlFor="estado-avaliacao">
                    Estado de conservação
                  </label>

                  <select
                    id="estado-avaliacao"
                    value={estadoAvaliacao}
                    onChange={(evento) =>
                      setEstadoAvaliacao(evento.target.value)
                    }
                    disabled={salvandoAvaliacao}
                  >
                    <option value="pendente">
                      Pendente de avaliação
                    </option>

                    <option value="funcional">
                      Funcional
                    </option>

                    <option value="reparavel">
                      Reparável
                    </option>

                    <option value="irrecuperavel">
                      Irrecuperável
                    </option>
                  </select>
                </div>

                {/* ===== BOTÕES DA AVALIAÇÃO ===== */}

                <div className="admin-formulario-botoes">
                  <button
                    type="button"
                    className="admin-cancelar"
                    onClick={fecharAvaliacao}
                    disabled={salvandoAvaliacao}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="admin-salvar"
                    disabled={
                      salvandoAvaliacao ||
                      estadoAvaliacao === equipamentoSelecionado.estado
                    }
                  >
                    {salvandoAvaliacao
                      ? "Salvando..."
                      : "Salvar avaliação"}
                  </button>
                </div>

              </form>
            </div>
          )}


{/* ===== POP-UP DE DISPONIBILIZAÇÃO ===== */}

{equipamentoParaDoacao && (
  <div
    className="admin-modal-fundo"
    onMouseDown={(evento) => {
      // Fecha a janela ao clicar fora dela
      if (
        evento.target === evento.currentTarget &&
        !publicandoDoacao
      ) {
        fecharDisponibilizacao();
      }
    }}
  >
    <div
      className="admin-formulario admin-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-disponibilizar"
    >

      {/* ===== CABEÇALHO DO POP-UP ===== */}

      <div className="admin-modal-topo">
        <h3 id="titulo-disponibilizar">
          Disponibilizar para doação
        </h3>

        <button
          type="button"
          className="admin-modal-fechar"
          onClick={fecharDisponibilizacao}
          disabled={publicandoDoacao}
          aria-label="Fechar janela"
        >
          ×
        </button>
      </div>

      {/* ===== INFORMAÇÕES DO EQUIPAMENTO ===== */}

      <div className="admin-avaliacao-info">
        <h4>{equipamentoParaDoacao.nome}</h4>
        <p>
          <strong>Código:</strong>{" "}
          {equipamentoParaDoacao.codigo}
        </p>
        <p>
          <strong>Estado:</strong>{" "}
          {equipamentoParaDoacao.estado}
        </p>
      </div>

      <p className="admin-doacao-aviso">
        Deseja disponibilizar este equipamento para doação?
      </p>

      {/* ===== MENSAGEM DE ERRO ===== */}

      {erroDoacao && (
        <div className="admin-erro" role="alert">
          {erroDoacao}
        </div>
      )}

      {/* ===== BOTÕES DE CONFIRMAÇÃO ===== */}

      <div className="admin-formulario-botoes">
        <button
          type="button"
          className="admin-cancelar"
          onClick={fecharDisponibilizacao}
          disabled={publicandoDoacao}
        >
          Cancelar
        </button>

        <button
          type="button"
          className="admin-salvar"
          onClick={disponibilizarEquipamento}
          disabled={publicandoDoacao}
        >
          {publicandoDoacao
            ? "Disponibilizando..."
            : "Confirmar disponibilização"}
        </button>
      </div>
    </div>
  </div>
)}



          {/* ===== TABELA DE EQUIPAMENTOS ===== */}

          <div className="admin-tabela-container">
            <table className="admin-tabela">

              <thead>
                <tr>
                  <th>Código</th>
                  <th>Equipamento</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Estado</th>
                  <th>Situação</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {equipamentos.map((equipamento) => (
                  <tr key={equipamento.id}>
                    <td>{equipamento.codigo}</td>
                    <td>{equipamento.nome}</td>
                    <td>{equipamento.marca || "—"}</td>
                    <td>{equipamento.modelo || "—"}</td>
                   {/* ===== ESTADO DO EQUIPAMENTO ===== */}
                <td>
                <span
                    className={`admin-etiqueta estado-${equipamento.estado}`}
                 >
                 {equipamento.estado === "pendente"
                  ? "Pendente de avaliação"
                  : equipamento.estado === "funcional"
                  ? "Funcional"
                  : equipamento.estado === "reparavel"
                  ? "Reparável"
                  : equipamento.estado === "irrecuperavel"
                  ? "Irrecuperável"
                 : equipamento.estado}
                </span>
                </td>

{/* ===== SITUAÇÃO DO EQUIPAMENTO ===== */}

<td>
  <span
    className={`admin-etiqueta situacao-${equipamento.situacao}`}
  >
    {equipamento.situacao === "em_avaliacao"
      ? "Em avaliação"
      : equipamento.situacao === "disponivel_doacao"
      ? "Disponível para doação"
      : equipamento.situacao === "reservado"
      ? "Reservado"
      : equipamento.situacao === "destinado"
      ? "Destinado"
      : equipamento.situacao}
  </span>
</td>




{/* ===== BOTÕES DE AÇÕES DO EQUIPAMENTO ===== */}

<td>
  {/* ===== BOTÃO DE AVALIAÇÃO ===== */}
  <button
    type="button"
    className="admin-avaliar"
    onClick={() => abrirAvaliacao(equipamento)}
  >
    Avaliar
  </button>

  {/* ===== BOTÃO DE DISPONIBILIZAÇÃO ===== */}
  {equipamento.estado === "funcional" &&
    equipamento.situacao !== "disponivel_doacao" && (
      <button
        type="button"
        className="admin-disponibilizar"
        onClick={() => abrirDisponibilizacao(equipamento)}
      >
        Disponibilizar
      </button>
    )}
</td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* ===== LISTA VAZIA ===== */}

          {!carregando && !erro && equipamentos.length === 0 && (
            <p className="admin-vazio">
              Nenhum equipamento cadastrado.
            </p>
          )}

        </section>
      )}


{/* ===== GERENCIAMENTO DE DOAÇÕES ===== */}

{paginaAtual === "doacoes" && (
  <section className="admin-secao">

    <div className="admin-secao-topo">
      <div>
        <h2>Gerenciamento de Doações</h2>
        <p>
          Acompanhe todas as publicações de equipamentos
          cadastradas no ReConecta.
        </p>
      </div>
    </div>

    {/* ===== INDICADORES DE DOAÇÕES ===== */}

    <div className="admin-indicadores">
      <div className="admin-card">
        <h3>Total de publicações</h3>
        <strong>{todasDoacoes.length}</strong>
      </div>

      <div className="admin-card">
        <h3>Disponíveis</h3>
        <strong>
          {todasDoacoes.filter(
            (doacao) =>
              doacao.status === "disponivel" &&
              doacao.situacao === "disponivel_doacao"
          ).length}
        </strong>
      </div>
    </div>

    {/* ===== TABELA DE PUBLICAÇÕES ===== */}

    <div className="admin-tabela-container">
      <table className="admin-tabela">
        <thead>
          <tr>
            <th>Código</th>
            <th>Equipamento</th>
            <th>Título da publicação</th>
            <th>Estado</th>
            <th>Status</th>
            <th>Situação</th>
          </tr>
        </thead>

        <tbody>
          {todasDoacoes.map((doacao) => (
            <tr key={doacao.id}>
              <td>{doacao.codigo}</td>
              <td>{doacao.equipamento}</td>
              <td>{doacao.titulo}</td>
              <td>
                <span
                  className={`admin-etiqueta estado-${doacao.estado}`}
                >
                  {doacao.estado}
                </span>
              </td>

{/* ===== STATUS DA PUBLICAÇÃO ===== */}

<td>
  <span className={`admin-etiqueta doacao-status-${doacao.status}`}>
    {doacao.status === "disponivel"
      ? "Disponível"
      : doacao.status === "reservada"
      ? "Reservada"
      : doacao.status === "concluida"
      ? "Concluída"
      : doacao.status === "cancelada"
      ? "Cancelada"
      : doacao.status}
  </span>
</td>

{/* ===== SITUAÇÃO DO EQUIPAMENTO ===== */}

<td>
  <span className={`admin-etiqueta situacao-${doacao.situacao}`}>
    {doacao.situacao === "em_avaliacao"
      ? "Em avaliação"
      : doacao.situacao === "disponivel_doacao"
      ? "Disponível para doação"
      : doacao.situacao === "reservado"
      ? "Reservado"
      : doacao.situacao === "destinado"
      ? "Destinado"
      : doacao.situacao}
  </span>
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {!carregando && todasDoacoes.length === 0 && (
      <p className="admin-vazio">
        Nenhuma publicação de doação cadastrada.
      </p>
    )}

  </section>
)}


{/* ===== GERENCIAMENTO DE PONTOS DE COLETA ===== */}

{paginaAtual === "pontos" && (
  <section className="admin-secao">

    {/* ===== CABEÇALHO DA SEÇÃO ===== */}


{/* ===== CABEÇALHO DOS PONTOS DE COLETA ===== */}

<div className="admin-secao-topo">
  <div>
    <h2>Pontos de coleta cadastrados</h2>
    <p>
      Visualize e acompanhe os locais de recebimento
      de equipamentos eletrônicos.
    </p>
  </div>

  {/* ===== FUTURO CADASTRO DE PONTOS ===== */}

  <button
  type="button"
  className="admin-botao"
  onClick={() => setMostrarFormularioPonto(true)}
>
  + Novo ponto de coleta
</button>
</div>


{/* ===== POP-UP DE CADASTRO DE PONTO DE COLETA ===== */}

{mostrarFormularioPonto && (
  <div
    className="admin-modal-fundo"
    onMouseDown={(evento) => {
      // Fecha ao clicar fora do formulário
      if (evento.target === evento.currentTarget) {
        setMostrarFormularioPonto(false);
      }
    }}
  >
    <form
      className="admin-formulario admin-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-novo-ponto"
      onSubmit={(evento) => evento.preventDefault()}
    >

      {/* ===== CABEÇALHO DO POP-UP ===== */}

      <div className="admin-modal-topo">
        <h3 id="titulo-novo-ponto">
          Cadastrar ponto de coleta
        </h3>

        <button
          type="button"
          className="admin-modal-fechar"
          onClick={() => setMostrarFormularioPonto(false)}
          aria-label="Fechar formulário"
        >
          ×
        </button>
      </div>

      {/* ===== CAMPOS DO FORMULÁRIO ===== */}

      <div className="admin-campos">

        <div className="admin-campo admin-campo-largo">
          <label htmlFor="ponto-nome">Nome do ponto</label>
          <input
            id="ponto-nome"
            placeholder="Ex.: Ecoponto Centro"
          />
        </div>

        <div className="admin-campo admin-campo-largo">
          <label htmlFor="ponto-endereco">Endereço</label>
          <input
            id="ponto-endereco"
            placeholder="Ex.: Rua das Flores, 100"
          />
        </div>

        <div className="admin-campo">
          <label htmlFor="ponto-bairro">Bairro</label>
          <input
            id="ponto-bairro"
            placeholder="Ex.: Centro"
          />
        </div>

        <div className="admin-campo">
          <label htmlFor="ponto-cidade">Cidade</label>
          <input
            id="ponto-cidade"
            placeholder="Ex.: Vila Velha"
          />
        </div>

        <div className="admin-campo">
          <label htmlFor="ponto-estado">Estado (UF)</label>
          <input
            id="ponto-estado"
            placeholder="Ex.: ES"
            maxLength={2}
          />
        </div>

        <div className="admin-campo">
          <label htmlFor="ponto-horario">Horário de funcionamento</label>
          <input
            id="ponto-horario"
            placeholder="Ex.: Seg a Sex, 08h às 17h"
          />
        </div>

        <div className="admin-campo admin-campo-largo">
          <label htmlFor="ponto-materiais">Materiais aceitos</label>
          <textarea
            id="ponto-materiais"
            placeholder="Ex.: Computadores, impressoras e componentes"
            rows={3}
          />
        </div>

      </div>

      {/* ===== BOTÕES DO FORMULÁRIO ===== */}

      <div className="admin-formulario-botoes">
        <button
          type="button"
          className="admin-cancelar"
          onClick={() => setMostrarFormularioPonto(false)}
        >
          Cancelar
        </button>

        <button
          type="button"
          className="admin-salvar"
          disabled
          title="O cadastro será implementado na próxima etapa funcional"
        >
          Salvar ponto (em breve)
        </button>
      </div>

    </form>
  </div>
)}

    {/* ===== INDICADOR DE PONTOS ===== */}

    <div className="admin-indicadores">
      <div className="admin-card">
        <h3>Total de pontos cadastrados</h3>
        <strong>{carregando ? "..." : pontos.length}</strong>
      </div>
    </div>

    {/* ===== TABELA DE PONTOS DE COLETA ===== */}

    <div className="admin-tabela-container">
      <table className="admin-tabela">

        <thead>
          <tr>
            <th>Nome</th>
            <th>Cidade</th>
            <th>Bairro</th>
            <th>Endereço</th>
            <th>Materiais aceitos</th>
            <th>Horário</th>
          </tr>
        </thead>

        <tbody>
          {pontos.map((ponto) => (
            <tr key={ponto.id}>
              <td>{ponto.nome}</td>

              <td>
                {ponto.cidade || "—"}
                {ponto.estado ? `/${ponto.estado}` : ""}
              </td>

              <td>{ponto.bairro || "—"}</td>

              <td>{ponto.endereco || "Não informado"}</td>

              <td>
                {ponto.materiais_aceitos || "Não informado"}
              </td>

              <td>
                {ponto.horario_funcionamento || "A definir"}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>

    {/* ===== MENSAGEM SEM PONTOS ===== */}

    {!carregando && !erro && pontos.length === 0 && (
      <p className="admin-vazio">
        Nenhum ponto de coleta cadastrado.
      </p>
    )}

  </section>
)}


      </main>
    </div>
  );
}

export default Admin;
