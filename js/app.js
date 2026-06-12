const estado = { vagas: [], filtradas: [] };

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
  
  // Elementos do Modal de Candidatura
  modalMensagem: document.getElementById('modalMensagem'),
  vagaIdInscricao: document.getElementById('vagaIdInscricao'),
  inputNome: document.getElementById('inputNome'),
  inputEmail: document.getElementById('inputEmail'),
  inputTelefone: document.getElementById('inputTelefone'),
  btnConfirmarCandidatura: document.getElementById('btnConfirmarCandidatura'),
  
  // Elementos do Chatbot
  chatContainer: document.getElementById('chatbot-container'),
  btnAbrirChat: document.getElementById('btnAbrirChat'),
  btnFecharChat: document.getElementById('btnFecharChat'),
  btnEnviarChat: document.getElementById('btnEnviarChat'),
  inputChat: document.getElementById('inputChat'),
  chatMessages: document.getElementById('chatbot-messages')
};

function normalizarTexto(valor) { return (valor || '').toString().trim().toLowerCase(); }
function obterCampo(vaga, chaves) {
  for (const chave of chaves) {
    if (vaga[chave] !== undefined && vaga[chave] !== null && vaga[chave] !== '') return vaga[chave];
  }
  return '';
}

function mostrarMensagem(texto, tipo = 'info', el = elementos.mensagem) {
  el.textContent = texto;
  el.className = `alert mt-3 ${tipo === 'erro' ? 'alert-danger' : tipo === 'sucesso' ? 'alert-success' : 'alert-secondary'}`;
  el.classList.remove('d-none');
}

function esconderMensagem(el = elementos.mensagem) {
  el.classList.add('d-none');
  el.textContent = '';
}

function preencherFiltros(vagas) {
  const areas = [...new Set(vagas.map(v => obterCampo(v, ['area'])).filter(Boolean))].sort();
  const modalidades = [...new Set(vagas.map(v => obterCampo(v, ['modalidade'])).filter(Boolean))].sort();

  elementos.filtroArea.innerHTML = '<option value="">Todas</option>' + areas.map(a => `<option value="${a}">${a}</option>`).join('');
  elementos.filtroModalidade.innerHTML = '<option value="">Todas</option>' + modalidades.map(m => `<option value="${m}">${m}</option>`).join('');
}

function aplicarFiltros() {
  const termo = normalizarTexto(elementos.busca.value);
  const areaSelecionada = normalizarTexto(elementos.filtroArea.value);
  const modSelecionada = normalizarTexto(elementos.filtroModalidade.value);

  estado.filtradas = estado.vagas.filter(vaga => {
    const titulo = normalizarTexto(obterCampo(vaga, ['titulo']));
    const descricao = normalizarTexto(obterCampo(vaga, ['descricao']));
    const area = normalizarTexto(obterCampo(vaga, ['area']));
    const modalidade = normalizarTexto(obterCampo(vaga, ['modalidade']));

    const atendeBusca = !termo || titulo.includes(termo) || descricao.includes(termo) || area.includes(termo);
    const atendeArea = !areaSelecionada || area === areaSelecionada;
    const atendeMod = !modSelecionada || modalidade === modSelecionada;

    return atendeBusca && atendeArea && atendeMod;
  });

  atualizarIndicadores();
  renderizarVagas();
}

function atualizarIndicadores() {
  elementos.totalVagas.textContent = estado.vagas.length;
  elementos.totalFiltradas.textContent = estado.filtradas.length;
}

// Abre o modal e registra o ID da vaga clicada
function prepararCandidatura(idVaga) {
  elementos.vagaIdInscricao.value = idVaga;
  esconderMensagem(elementos.modalMensagem);
}

// Dispara o fluxo real de Candidatura consumindo os campos
async function processarCandidatura() {
  const nome = elementos.inputNome.value.trim();
  const email = elementos.inputEmail.value.trim();
  const telefone = elementos.inputTelefone.value.trim();
  const vagaId = elementos.vagaIdInscricao.value;

  if (!nome || !email || !vagaId) {
    mostrarMensagem('Por favor, preencha todos os campos obrigatórios.', 'erro', elementos.modalMensagem);
    return;
  }

  try {
    elementos.btnConfirmarCandidatura.disabled = true;
    elementos.btnConfirmarCandidatura.textContent = 'Enviando candidatura...';

    const candidato = await criarCandidato({ nome, email, telefone });
    await criarInscricao({ candidato_id: candidato.id, vaga_id: parseInt(vagaId) });

    mostrarMensagem('Sua candidatura foi enviada com sucesso! Você receberá atualizações por e-mail e WhatsApp.', 'sucesso', elementos.modalMensagem);
    
    // Limpar campos
    elementos.inputNome.value = '';
    elementos.inputEmail.value = '';
    elementos.inputTelefone.value = '';

  } catch (erro) {
    console.error(erro);
    mostrarMensagem('Não foi possível concluir sua candidatura. Verifique os dados informados e tente novamente.', 'erro', elementos.modalMensagem);
  } finally {
    elementos.btnConfirmarCandidatura.disabled = false;
    elementos.btnConfirmarCandidatura.textContent = 'Enviar Candidatura';
  }
}

function criarCardVaga(vaga) {
  const titulo = obterCampo(vaga, ['titulo']) || 'Vaga sem título';
  const descricao = obterCampo(vaga, ['descricao']) || 'Sem descrição.';
  const area = obterCampo(vaga, ['area']) || 'Não especificada';
  const modalidade = obterCampo(vaga, ['modalidade']) || 'Não especificada';
  const idBotao = `btn-candidatar-${vaga.id}`;

  setTimeout(() => {
    const botao = document.getElementById(idBotao);
    if (botao) {
      botao.addEventListener('click', () => prepararCandidatura(vaga.id));
    }
  }, 0);

  return `
    <div class="col-md-6 col-xl-4">
      <article class="job-card">
        <div class="job-card-header">
          <h3 class="job-title">${titulo}</h3>
        </div>
        <p class="job-description mb-0">${descricao}</p>
        <div class="meta-badges">
          <span class="meta-badge">Área: ${area}</span>
          <span class="meta-badge">Modalidade: ${modalidade}</span>
        </div>
        <div class="job-actions">
          <button class="btn btn-outline-custom btn-sm" id="${idBotao}" type="button" data-bs-toggle="modal" data-bs-target="#modalCandidatura">Candidatar-se</button>
        </div>
      </article>
    </div>
  `;
}

function renderizarVagas() {
  if (!estado.filtradas.length) {
    elementos.listaVagas.innerHTML = '<div class="col-12"><div class="job-card job-empty">Nenhuma vaga encontrada.</div></div>';
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
    elementos.statusApi.textContent = 'Falha';
    mostrarMensagem('Não foi possível carregar as vagas no momento. Tente novamente mais tarde.', 'erro');
  } finally {
    elementos.loading.classList.add('d-none');
  }
}

async function testarApi() {
  try {
    await testarConexaoApi();
    elementos.statusApi.textContent = 'Online';
    mostrarMensagem('Sistema funcionando normalmente.', 'sucesso');
  } catch (erro) {
    elementos.statusApi.textContent = 'Indisponível';
    mostrarMensagem('O sistema está temporariamente indisponível.', 'erro');
  }
}

// LÓGICA DO CHATBOT
function adicionarMensagemChat(texto, remetente) {
  const div = document.createElement('div');
  div.className = `chat-message ${remetente === 'user' ? 'user-message' : 'bot-message'}`;
  div.textContent = texto;
  elementos.chatMessages.appendChild(div);
  elementos.chatMessages.scrollTop = elementos.chatMessages.scrollHeight;
}

async function handleEnviarChat() {
  const msg = elementos.inputChat.value.trim();
  if (!msg) return;

  adicionarMensagemChat(msg, 'user');
  elementos.inputChat.value = '';
  
  // Exibir indicador temporário de digitação
  const idTyping = 'typing-' + Date.now();
  const divTyping = document.createElement('div');
  divTyping.id = idTyping;
  divTyping.className = 'chat-message bot-message text-muted';
  divTyping.textContent = 'Digitando...';
  elementos.chatMessages.appendChild(divTyping);
  elementos.chatMessages.scrollTop = elementos.chatMessages.scrollHeight;

  try {
    const resposta = await enviarMensagemChat(msg);
    document.getElementById(idTyping).remove();
    
    // 1. Exibe a resposta em texto do bot
    adicionarMensagemChat(resposta.resposta || 'Erro na resposta do assistente.', 'bot');

    // 2. NOVA LÓGICA: Executa ações na tela com base na intenção retornada pelo backend
    if (resposta.intencao === 'consulta_vagas') {
        // Rola a tela suavemente para a área de busca de vagas
        document.getElementById('filtros').scrollIntoView({ behavior: 'smooth' });
    } else if (resposta.intencao === 'candidatura') {
        // Exibe um aviso em tela orientando o usuário a clicar nos botões das vagas
        mostrarMensagem('Selecione a vaga desejada e clique em "Candidatar-se" para continuar.', 'info');
        document.getElementById('filtros').scrollIntoView({ behavior: 'smooth' });
    }

  } catch (error) {
    if (document.getElementById(idTyping)) {
        document.getElementById(idTyping).remove();
    }
    adicionarMensagemChat('Desculpe, não consegui responder sua solicitação no momento. Tente novamente em alguns instantes.', 'bot');
  }
}

function configurarTema() {
  let temaAtual = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', temaAtual);
  if (elementos.themeToggle) {
    elementos.themeToggle.addEventListener('click', () => {
      temaAtual = temaAtual === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', temaAtual);
    });
  }
}

function registrarEventos() {
  elementos.busca.addEventListener('input', aplicarFiltros);
  elementos.filtroArea.addEventListener('change', aplicarFiltros);
  elementos.filtroModalidade.addEventListener('change', aplicarFiltros);
  elementos.btnRecarregar.addEventListener('click', carregarVagas);  
  // Eventos do Modal
  elementos.btnConfirmarCandidatura.addEventListener('click', processarCandidatura);

  // Eventos do Chatbot
  elementos.btnAbrirChat.addEventListener('click', () => elementos.chatContainer.classList.remove('d-none'));
  elementos.btnFecharChat.addEventListener('click', () => elementos.chatContainer.classList.add('d-none'));
  elementos.btnEnviarChat.addEventListener('click', handleEnviarChat);
  elementos.inputChat.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleEnviarChat();
  });
}

function iniciar() {
  configurarTema();
  registrarEventos();
  carregarVagas();
}

document.addEventListener('DOMContentLoaded', iniciar);
