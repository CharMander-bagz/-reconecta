
import { useEffect, useState } from "react";
import api from "./services/api";
import "./App.css";

function App() {
  // ===== ESTADOS DO SISTEMA =====

  const [pagina, setPagina] = useState("inicio");
  const [doacoes, setDoacoes] = useState([]);
  const [pontos, setPontos] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  // ===== CARREGAMENTO DOS DADOS =====

  // Consulta as doações e os pontos de coleta na API
  useEffect(() => {
    async function carregarDados() {
      try {
        const [resDoacoes, resPontos] = await Promise.all([
          api.get("/doacoes"),
          api.get("/pontos-coleta")
        ]);

        setDoacoes(resDoacoes.data);
        setPontos(resPontos.data);
        setErro("");
      } catch (error) {
        console.error(error);
        setErro("Não foi possível conectar ao servidor.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  // ===== FUNÇÕES DE NAVEGAÇÃO =====

  // Troca a página exibida e leva o usuário ao topo
  function mudarPagina(novaPagina) {
    setPagina(novaPagina);
    window.scrollTo(0, 0);
  }

  // ===== INTERFACE PRINCIPAL =====

  return (
    <div className="app">

      {/* ===== CABEÇALHO ===== */}

      <header className="cabecalho">
        <div className="logo" onClick={() => mudarPagina("inicio")}>
          <span className="logo-icone">♻</span>
          <span>Re<span className="logo-roxo">Conecta</span></span>
        </div>

        {/* ===== BOTÕES DE NAVEGAÇÃO ===== */}

        <nav>
          <button
            className={pagina === "inicio" ? "ativo" : ""}
            onClick={() => mudarPagina("inicio")}
          >
            Início
          </button>

          <button
            className={pagina === "doacoes" ? "ativo" : ""}
            onClick={() => mudarPagina("doacoes")}
          >
            Doações
          </button>

          <button
            className={pagina === "pontos" ? "ativo" : ""}
            onClick={() => mudarPagina("pontos")}
          >
            Pontos de coleta
          </button>
        </nav>
      </header>

      {/* ===== CONTEÚDO PRINCIPAL ===== */}

      <main className="conteudo">

        {erro && <p className="erro">{erro}</p>}

        {/* ===== PÁGINA INICIAL ===== */}

        {pagina === "inicio" && (
          <section className="inicio">

            <div className="hero">
              <div className="hero-conteudo">
                <span className="hero-etiqueta">
                  ♻ TECNOLOGIA COM PROPÓSITO
                </span>

                <h1>
                  Conectando{" "}
                  <span className="texto-roxo">tecnologia</span>
                  {" "}e{" "}
                  <span className="texto-verde">
                    sustentabilidade
                  </span>
                </h1>

                <p>
                  O ReConecta incentiva o reaproveitamento de
                  equipamentos eletrônicos, a inclusão digital
                  e o descarte ambientalmente adequado.
                </p>

                {/* ===== BOTÃO PRINCIPAL ===== */}

                
{/* ===== BOTÕES PRINCIPAIS ===== */}

<div className="hero-acoes">

  <button
    className="botao-principal"
    onClick={() => mudarPagina("doacoes")}
  >
    ♻ Ver equipamentos disponíveis
    <span>→</span>
  </button>

  <button
    className="botao-secundario"
    onClick={() => mudarPagina("pontos")}
  >
    ⌖ Encontrar pontos de coleta
  </button>

</div>

              </div>

              {/* ===== ILUSTRAÇÃO TECNOLÓGICA ===== */}

              <div className="hero-visual" aria-hidden="true">
                <div className="circulo-luz">
                  <span className="simbolo-reciclagem">♻</span>
                  <span className="simbolo-tecnologia">🖳</span>
                </div>
              </div>
            </div>

{/* ===== COMO FUNCIONA O RECONECTA ===== */}

<section className="como-funciona">
  <div className="como-funciona-cabecalho">
    <span className="como-funciona-etiqueta">
      ♻ TRANSFORMANDO TECNOLOGIA
    </span>

    <h2>Como funciona o <span>ReConecta?</span></h2>

    <p>
      Da coleta ao reaproveitamento, cada equipamento
      pode ganhar uma nova oportunidade.
    </p>
  </div>

  {/* ===== ETAPAS DO PROCESSO ===== */}

  <div className="como-funciona-grade">

    <article className="etapa-card">
      <span className="etapa-numero">01</span>
      <div className="etapa-icone">⌖</div>
      <h3>Coleta</h3>
      <p>
        Equipamentos eletrônicos são recebidos e
        encaminhados para avaliação.
      </p>
    </article>

    <article className="etapa-card">
      <span className="etapa-numero">02</span>
      <div className="etapa-icone">⚙</div>
      <h3>Avaliação</h3>
      <p>
        Cada equipamento é analisado para identificar
        suas condições de funcionamento e possibilidades
        de recuperação.
      </p>
    </article>

    <article className="etapa-card">
      <span className="etapa-numero">03</span>
      <div className="etapa-icone">♻</div>
      <h3>Reaproveitamento</h3>
      <p>
        Equipamentos aptos podem ser disponibilizados
        para doação, incentivando a inclusão digital.
      </p>
    </article>

  </div>
</section>

            {/* ===== BENEFÍCIOS DO PROJETO ===== */}

            <div className="beneficios">
              <div className="beneficio">
                <span className="beneficio-icone verde">⸙</span>
                <div>
                  <h3>Reaproveitamento</h3>
                  <p>Consciente</p>
                </div>
              </div>

              <div className="beneficio">
                <span className="beneficio-icone roxo">⌨</span>
                <div>
                  <h3>Inclusão</h3>
                  <p>Digital</p>
                </div>
              </div>

              <div className="beneficio">
                <span className="beneficio-icone verde">⌯⛟</span>
                <div>
                  <h3>Descarte</h3>
                  <p>Responsável</p>
                </div>
              </div>
            </div>
          </section>
        )}

      
{/* ===== PÁGINA DE DOAÇÕES ===== */}

{pagina === "doacoes" && (
  <section className="pagina-listagem">

    {/* ===== TÍTULO DA PÁGINA ===== */}

    <div className="titulo-pagina">
      <span className="titulo-icone">🖳</span>

      <div>
        <h2>Equipamentos para doação</h2>
        <p>Dê um novo propósito à tecnologia.</p>
      </div>
    </div>

    {/* ===== CARREGAMENTO ===== */}

    {carregando && <p>Carregando doações...</p>}

    
{/* ===== PESQUISA E FILTROS DE DOAÇÕES ===== */}

<div className="doacoes-filtros">

  {/* ===== CAMPO DE PESQUISA ===== */}

  <div className="doacoes-busca">
    <span className="doacoes-busca-icone">⌕</span>

    <input
      type="text"
      placeholder="Pesquisar equipamentos por nome, marca ou modelo..."
      aria-label="Pesquisar equipamentos"
    />
  </div>

  {/* ===== FILTROS POR CATEGORIA ===== */}

  <div className="doacoes-filtros-linha">
    <span className="doacoes-filtros-titulo">Categoria:</span>

    <div className="doacoes-categorias">
      <span className="doacoes-filtro ativo">Todos</span>
      <span className="doacoes-filtro">Computadores</span>
      <span className="doacoes-filtro">Impressoras</span>
      <span className="doacoes-filtro">Celulares</span>
      <span className="doacoes-filtro">Outros</span>
    </div>
  </div>

  {/* ===== FILTROS POR ESTADO ===== */}

  <div className="doacoes-filtros-linha">
    <span className="doacoes-filtros-titulo">Estado:</span>

    <div className="doacoes-categorias">
      <span className="doacoes-filtro ativo">Todos</span>
      <span className="doacoes-filtro">Funcional</span>
      <span className="doacoes-filtro">Reparável</span>
    </div>
  </div>

  {/* ===== CONTADOR DE EQUIPAMENTOS ===== */}

  <div className="doacoes-resultados">
    <span className="doacoes-resultados-icone">♻</span>
    <strong>{doacoes.length}</strong>
    {doacoes.length === 1
      ? " equipamento disponível"
      : " equipamentos disponíveis"}
  </div>

</div>


    {/* ===== CATÁLOGO DE EQUIPAMENTOS ===== */}

    <div className="grade grade-doacoes">
      {doacoes.map((item) => (
        <article className="card card-doacao" key={item.id}>

          {/* ===== ÁREA VISUAL DO EQUIPAMENTO ===== */}

          <div className="doacao-visual">
            <span className="doacao-categoria">
              {item.tipo || "Eletrônico"}
            </span>

            <span className="doacao-icone">
              {item.tipo?.toLowerCase().includes("impressora")
                ? "모"
                : item.tipo?.toLowerCase().includes("computador")
                  ? "🖳"
                  : "⌘"}
            </span>

            <span className="doacao-disponibilidade">
              ● Disponível
            </span>
          </div>

          {/* ===== INFORMAÇÕES DO EQUIPAMENTO ===== */}

          <div className="doacao-conteudo">
            <h3>{item.titulo}</h3>

            <p className="doacao-descricao">
              {item.descricao_publica ||
                "Equipamento disponível para reaproveitamento."}
            </p>

            {/* ===== CARACTERÍSTICAS ===== */}

            <div className="doacao-detalhes">
              <div>
                <span>Marca</span>
                <strong>{item.marca || "Não informada"}</strong>
              </div>

              <div>
                <span>Modelo</span>
                <strong>{item.modelo || "Não informado"}</strong>
              </div>

              <div>
                <span>Estado</span>
                <strong>{item.estado || "Não informado"}</strong>
              </div>
            </div>

            {/* ===== RODAPÉ DO CARD ===== */}

            <div className="doacao-rodape">
              <span className="doacao-selo">
                ♻ Reaproveitamento consciente
              </span>
            </div>
          </div>

        </article>
      ))}
    </div>

    {/* ===== MENSAGEM SEM DOAÇÕES ===== */}

    {!carregando && !erro && doacoes.length === 0 && (
      <p>Nenhuma doação disponível no momento.</p>
    )}

  </section>
)}


        {/* ===== PÁGINA DE PONTOS DE COLETA ===== */}

        {pagina === "pontos" && (
          <section className="pagina-listagem">
            <div className="titulo-pagina">
              <span className="titulo-icone">⌯⌲</span>
              <div>
                <h2>Pontos de coleta</h2>
                <p>
                  Encontre locais para o descarte responsável.
                </p>
              </div>
            </div>

            {carregando && <p>Carregando pontos de coleta...</p>}

            
{/* ===== PESQUISA E FILTROS DE COLETA ===== */}

<div className="coleta-filtros">

  {/* Campo de pesquisa */}
  <div className="coleta-busca">
    <span className="coleta-busca-icone">⌕</span>

    <input
      type="text"
      placeholder="Pesquisar por nome, cidade ou bairro..."
      aria-label="Pesquisar pontos de coleta"
    />
  </div>

  {/* Filtros por material */}
  <div className="coleta-categorias">
    <span className="coleta-filtros-titulo">
      Materiais:
    </span>

    <button type="button" className="coleta-filtro ativo">
      Todos
    </button>

    <button type="button" className="coleta-filtro">
      Computadores
    </button>

    <button type="button" className="coleta-filtro">
      Impressoras
    </button>

    <button type="button" className="coleta-filtro">
      Componentes
    </button>

    <button type="button" className="coleta-filtro">
      Outros
    </button>
  </div>

  {/* Contador de locais */}
  <div className="coleta-resultados">
    <span>⌖</span>
    <strong>{pontos.length}</strong>
    {pontos.length === 1
      ? " ponto cadastrado"
      : " pontos cadastrados"}
  </div>

</div>


{/* ===== EXPLORADOR DE PONTOS DE COLETA ===== */}

<div className="coleta-explorador">

          {/* ===== LISTA DE PONTOS ===== */}

          <div className="coleta-lista">
            <div className="grade grade-pontos">
              {pontos.map((ponto) => (
                <article className="card card-ponto" key={ponto.id}>

                  {/* ===== CABEÇALHO DO PONTO ===== */}

                  <div className="ponto-cabecalho">
                    <div className="ponto-icone">⌖</div>

                    <div>
                      <h3>{ponto.nome}</h3>
                      <span className="ponto-localidade">
                        {ponto.bairro} · {ponto.cidade}/{ponto.estado}
                      </span>
                    </div>
                  </div>

                  {/* ===== INFORMAÇÕES DO PONTO ===== */}

                  <div className="ponto-informacoes">
                    <div className="ponto-informacao">
                      <span className="ponto-informacao-icone">⌖</span>
                      <div>
                        <strong>Endereço</strong>
                        <p>{ponto.endereco || "Endereço não informado"}</p>
                      </div>
                    </div>

                    <div className="ponto-informacao">
                      <span className="ponto-informacao-icone">♻</span>
                      <div>
                        <strong>Materiais aceitos</strong>
                        <p>{ponto.materiais_aceitos || "Não informado"}</p>
                      </div>
                    </div>

                    <div className="ponto-informacao">
                      <span className="ponto-informacao-icone">◷</span>
                      <div>
                        <strong>Horário de funcionamento</strong>
                        <p>{ponto.horario_funcionamento || "A definir"}</p>
                      </div>
                    </div>
                  </div>

                  {/* ===== RODAPÉ DO CARD ===== */}

                  <div className="ponto-rodape">
                    <span className="ponto-aviso">
                      ♻ Descarte responsável
                    </span>
                  </div>

                </article>
              ))}
            </div>
          </div>

          {/* ===== MAPA: ESPAÇO RESERVADO ===== */}

          <aside className="coleta-mapa">

            <div className="coleta-mapa-topo">
              <div>
                <h3>Mapa dos pontos de coleta</h3>
              </div>
              <span className="coleta-mapa-etiqueta">Em breve</span>
            </div>

            <div className="coleta-mapa-conteudo">
              <div className="coleta-mapa-simbolo">⌖</div>
              <h4>EM BREVE</h4>
              <span>♻ Tecnologia a favor do meio ambiente</span>
            </div>

            <div className="coleta-mapa-rodape">
              <span>⌖ Localização dos pontos</span>
              <span>Visualização futura</span>
            </div>

          </aside>
        </div>

        {/* ===== MENSAGEM SEM PONTOS CADASTRADOS ===== */}

        {!carregando && !erro && pontos.length === 0 && (
          <p>Nenhum ponto de coleta cadastrado.</p>
        )}

      </section>
    )}

  </main>

  {/* ===== RODAPÉ ===== */}

  <footer>
  <span>♻ ReConecta</span>

  <p>
    Tecnologia e sustentabilidade © 2026
  </p>

  <p>
    Desenvolvido por Charlie Nayane Ferreira Prado
  </p>
</footer>

</div>
  );
}

export default App;
