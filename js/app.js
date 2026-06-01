const estado = {
  vagas: [],
  filtradas: [],
};

const elementos = {
  listaVagas: document.getElementById('listaVagas'),
  busca: document.getElementById('busca'),
  filtroArea: document.getElementById('filtroArea'),
  filtroModalidade: document.getElementById('filtroModalidade'),
  btnRecarregar: document.getElementById('btnRecarregar'),
  btnTestarApi: document.getElementById('btnTestarApi'),
  mensagem: document.getElementById('mensagem'),
  loading: document.getElementById('loading'),
  statusApi: document.getElementById('statusApi'),
  totalVagas: document.getElementById('totalVagas'),
  totalFiltradas: document.getElementById('totalFiltradas'),
  themeToggle: document.querySelector('[data-theme-toggle]'),
};

function normalizarTexto(valor) {
  return (valor || '').toString().trim().toLowerCase();
}

function obterCampo(vaga, chaves) {
  for (const chave of chaves) {
    if (vaga[chave] !== undefined && vaga[chave] !== null && vaga[chave] !== '') {
      return vaga[chave];
    }
  }
  return '';
}

function mostrarMensagem(texto, tipo = 'info') {
  elementos.mensagem.textContent = texto;
  elementos.mensagem.className = 'alert custom-alert mt-4';
  if (tipo === 'erro') elementos.mensagem.classList.add('alert-danger');
  else if (tipo === 'sucesso') elementos.mensagem.classList.add('alert-success');
  else elementos.mensagem.classList.add('alert-secondary');
}

function esconderMensagem() {
  elementos.mensagem.className = 'alert custom-alert mt-4 d-none';
  elementos.mensagem.textContent = '';
}

function preencherFiltros(vagas) {
  const areas = [...new Set(vagas.map(v => obterCampo(v, ['area', 'categoria', 'setor'])).filter(Boolean))].sort();
  const modalidades = [...new Set(vagas.map(v => obterCampo(v, ['modalidade', 'tipo', 'regime'])).filter(Boolean))].sort();

  elementos.filtroArea.innerHTML = '<option value="">Todas</option>' + areas.map(area => `<option value="${area}">${area}</option>`).join('');
  elementos.filtroModalidade.innerHTML = '<option value="">Todas</option>' + modalidades.map(item => `<option value="${item}">${item}</option>`).join('');
}

function aplicarFiltros() {
  const termo = normalizarTexto(elementos.busca.value);
  const areaSelecionada = normalizarTexto(elementos.filtroArea.value);
  const modalidadeSelecionada = normalizarTexto(elementos.filtroModalidade.value);

  estado.filtradas = estado.vagas.filter(vaga => {
    const titulo = normalizarTexto(obterCampo(vaga, ['titulo', 'nome', 'vaga']));
    const descricao = normalizarTexto(obterCampo(vaga, ['descricao', 'resumo']));
    const area = normalizarTexto(obterCampo(vaga, ['area', 'categoria', 'setor']));
    const modalidade = normalizarTexto(obterCampo(vaga, ['modalidade', 'tipo', 'regime']));

    const atendeBusca = !termo || titulo.includes(termo) || descricao.includes(termo) || area.includes(termo);
    const atendeArea = !areaSelecionada || area === areaSelecionada;
    const atendeModalidade = !modalidadeSelecionada || modalidade === modalidadeSelecionada;

    return atendeBusca && atendeArea && atendeModalidade;
  });

  atualizarIndicadores();
  renderizarVagas();
}

function atualizarIndicadores() {
  elementos.totalVagas.textContent = estado.vagas.length;
  elementos.totalFiltradas.textContent = estado.filtradas.length;
}

async function candidatarEmExemplo(vaga) {
  try {
    const payload = {
      nome: 'Maria Eduarda Schmidt',
      email: 'maria@example.com',
      vaga_id: vaga.id || vaga.vaga_id || null,
      vaga_titulo: obterCampo(vaga, ['titulo', 'nome', 'vaga'])
    };
    await enviarCandidatura(payload);
    mostrarMensagem('Candidatura enviada com sucesso para teste de integração.', 'sucesso');
  } catch (erro) {
    console.error(erro);
    mostrarMensagem('Não foi possível enviar a candidatura de teste. Verifique o endpoint /inscricoes.', 'erro');
  }
}

function criarCardVaga(vaga) {
  const titulo = obterCampo(vaga, ['titulo', 'nome', 'vaga']) || 'Vaga sem título';
  const empresa = obterCampo(vaga, ['empresa', 'organizacao']) || 'Empresa não informada';
  const descricao = obterCampo(vaga, ['descricao', 'resumo']) || 'Descrição não informada.';
  const area = obterCampo(vaga, ['area', 'categoria', 'setor']) || 'Área não informada';
  const modalidade = obterCampo(vaga, ['modalidade', 'tipo', 'regime']) || 'Modalidade não informada';
  const local = obterCampo(vaga, ['local', 'cidade']) || 'Local não informado';
  const salario = obterCampo(vaga, ['salario', 'faixa_salarial']) || 'A combinar';
  const link = obterCampo(vaga, ['link', 'url']);
  const idBotao = `btn-candidatar-${Math.random().toString(36).slice(2, 9)}`;

  setTimeout(() => {
    const botao = document.getElementById(idBotao);
    if (botao) botao.addEventListener('click', () => candidatarEmExemplo(vaga));
  }, 0);

  return `
    <div class="col-md-6 col-xl-4">
      <article class="job-card">
        <div class="job-card-header">
          <div>
            <h3 class="job-title">${titulo}</h3>
            <p class="job-meta mb-0">${empresa}</p>
          </div>
          <span class="badge text-bg-light border">${salario}</span>
        </div>
        <p class="job-description mb-0">${descricao}</p>
        <div class="meta-badges">
          <span class="meta-badge">Área: ${area}</span>
          <span class="meta-badge">Modalidade: ${modalidade}</span>
          <span class="meta-badge">Local: ${local}</span>
        </div>
        <div class="job-actions">
          ${link ? `<a class="btn btn-primary-custom btn-sm" href="${link}" target="_blank" rel="noopener noreferrer">Ver vaga</a>` : ''}
          <button class="btn btn-outline-custom btn-sm" id="${idBotao}" type="button">Candidatar</button>
        </div>
      </article>
    </div>
  `;
}

function renderizarVagas() {
  if (!estado.filtradas.length) {
    elementos.listaVagas.innerHTML = '<div class="col-12"><div class="job-card job-empty">Nenhuma vaga encontrada com os filtros informados.</div></div>';
    return;
  }

  elementos.listaVagas.innerHTML = estado.filtradas.map(criarCardVaga).join('');
}

async function carregarVagas() {
  esconderMensagem();
  elementos.loading.classList.remove('d-none');

  try {
    const dados = await buscarVagas();
    estado.vagas = Array.isArray(dados) ? dados : (dados.vagas || []);
    estado.filtradas = [...estado.vagas];
    preencherFiltros(estado.vagas);
    atualizarIndicadores();
    renderizarVagas();
    elementos.statusApi.textContent = 'Conectado';
  } catch (erro) {
    console.error(erro);
    elementos.statusApi.textContent = 'Falha';
    estado.vagas = [];
    estado.filtradas = [];
    atualizarIndicadores();
    renderizarVagas();
    mostrarMensagem('Não foi possível carregar a API. Verifique a URL do ngrok, CORS do backend e o endpoint /vagas.', 'erro');
  } finally {
    elementos.loading.classList.add('d-none');
  }
}

async function testarApi() {
  try {
    await testarConexaoApi();
    elementos.statusApi.textContent = 'Online';
    mostrarMensagem('Conexão com a API realizada com sucesso.', 'sucesso');
  } catch (erro) {
    console.error(erro);
    elementos.statusApi.textContent = 'Indisponível';
    mostrarMensagem('Falha ao conectar no backend. Confira o link do ngrok e a configuração de CORS.', 'erro');
  }
}

function configurarTema() {
  let temaAtual = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', temaAtual);
  elementos.themeToggle.addEventListener('click', () => {
    temaAtual = temaAtual === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', temaAtual);
  });
}

function registrarEventos() {
  elementos.busca.addEventListener('input', aplicarFiltros);
  elementos.filtroArea.addEventListener('change', aplicarFiltros);
  elementos.filtroModalidade.addEventListener('change', aplicarFiltros);
  elementos.btnRecarregar.addEventListener('click', carregarVagas);
  elementos.btnTestarApi.addEventListener('click', testarApi);
}

function iniciar() {
  configurarTema();
  registrarEventos();
  carregarVagas();
}

document.addEventListener('DOMContentLoaded', iniciar);