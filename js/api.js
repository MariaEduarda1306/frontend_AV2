async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
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

async function enviarCandidatura(payload) {
  return apiRequest(API_ENDPOINTS.candidatura, {
    method: 'POST',
    body: payload,
  });
}