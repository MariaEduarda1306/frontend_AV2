async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true', // ADICIONE ESTA LINHA
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let detalheErro = '';
    try {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const erroJson = await response.json();
        detalheErro = erroJson.erro || erroJson.mensagem || JSON.stringify(erroJson);
      } else {
        detalheErro = await response.text();
      }
    } catch {
      detalheErro = response.statusText;
    }

    throw new Error(`Erro ${response.status}: ${detalheErro || response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

async function buscarVagas() {
  return apiRequest(API_ENDPOINTS.vagas);
}

async function testarConexaoApi() {
  return apiRequest(API_ENDPOINTS.health);
}

async function criarCandidato(payload) {
  return apiRequest(API_ENDPOINTS.candidatos, {
    method: 'POST',
    body: payload,
  });
}

async function criarInscricao(payload) {
  return apiRequest(API_ENDPOINTS.candidatura, {
    method: 'POST',
    body: payload,
  });
}
