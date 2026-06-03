# Portal de Vagas - Frontend

Projeto de frontend para um portal de vagas de emprego, desenvolvido para a disciplina Linguagem de Programacao III (AV2). O sistema consome uma API REST (fornecida separadamente) e oferece interface com filtros, chatbot e fluxo de candidatura.

## Funcionalidades

- Listagem de vagas vindas da API
- Filtro por area e modalidade de trabalho
- Busca textual por titulo, descricao ou area
- Teste de conexao com o backend
- Chatbot interativo (com respostas locais ou IA)
- Modal de candidatura com envio de dados para a API
- Tema claro/escuro (manual ou automatico)
- Layout responsivo (Bootstrap 5 + CSS customizado)

## Tecnologias utilizadas

- HTML5
- CSS3 (com variaveis CSS para temas)
- JavaScript (Vanilla JS)
- Bootstrap 5
- Google Fonts (Inter)

## Estrutura de pastas

frontend_AV2/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   ├── api.js
│   └── app.js
└── rpa/

> Os scripts de automacao RPA (WhatsApp/E-mail) ficam em uma pasta separada (rpa/) e sao executados do lado do backend. Este README trata apenas do frontend.

## Configuracao da API

O frontend consome uma API REST que deve estar rodando em um servidor (local ou via ngrok). Para conectar, edite o arquivo js/config.js e altere a constante API_BASE_URL:

const API_BASE_URL = "https://seu-subdominio.ngrok-free.dev";

Se o backend estiver rodando localmente na mesma maquina, use http://127.0.0.1:5000.

Os endpoints esperados sao:

| Metodo | Endpoint       | Uso no frontend                     |
|--------|----------------|-------------------------------------|
| GET    | /              | Teste de conexao                    |
| GET    | /vagas         | Listar todas as vagas               |
| POST   | /candidatos    | Cadastrar candidato                 |
| POST   | /inscricoes    | Realizar inscricao (candidato+vaga) |
| POST   | /chat          | Enviar mensagem ao chatbot          |

## Como executar localmente

### Opcao 1 – Servidor HTTP simples (recomendado)
Na pasta raiz do frontend (frontend_AV2), execute:

python -m http.server 5500

Acesse http://localhost:5500 no navegador.

### Opcao 2 – Abrir diretamente o arquivo
Voce pode abrir o index.html diretamente, mas alguns recursos (como o modal do Bootstrap) podem ter comportamento limitado. A opcao 1 e preferivel.

## Publicacao no GitHub Pages

1. Crie um repositorio publico no GitHub.
2. Envie todos os arquivos do frontend_AV2 para a branch main.
3. No repositorio, va em Settings > Pages.
4. Em Branch, selecione main e a pasta /root.
5. Salve. O site estara disponivel em https://seu-usuario.github.io/frontend_AV2/.

Atencao: O GitHub Pages serve apenas arquivos estaticos. O backend (API) deve continuar rodando em um servidor separado, acessivel via ngrok ou outra forma, e a API_BASE_URL no config.js deve apontar para esse servidor.

## Chatbot

O chatbot esta implementado no frontend e se comunica com o endpoint /chat do backend.
- Se o backend retornar uma resposta, ela e exibida.
- Se houver falha, o frontend mostra a mensagem padrao: "Desculpe, meu sistema backend esta indisponivel no momento."

A logica de intencao (consulta de vagas, candidatura) pode ser tratada diretamente pelo backend ou por IA. O frontend apenas exibe as respostas e, quando solicitado, rola a tela para os filtros ou exibe avisos.

## Testando a integracao

1. Tenha o backend rodando (ex.: Flask + ngrok).
2. Atualize API_BASE_URL no config.js com a URL publica do backend.
3. Abra o frontend (local ou GitHub Pages).
4. Clique em "Testar conexao" – deve aparecer "Online".
5. As vagas devem ser carregadas automaticamente.
6. Use os filtros e a busca para refinar a lista.
7. Abra o chatbot e digite "vagas" ou "candidatar" para testar as intencoes.
8. Clique em "Candidatar-se" em uma vaga, preencha o formulario e envie – o backend criara o candidato e a inscricao, disparando as notificacoes RPA.

## Observacoes importantes

- O frontend nao executa os scripts de automacao (WhatsApp/E-mail) – eles sao disparados pelo backend apos a inscricao.
- O botao "Atualizar" recarrega a lista de vagas da API.
- O tema claro/escuro e salvo pela preferencia do sistema, mas nao ha persistencia entre sessoes (pode ser adicionada futuramente).
- Para que o chatbot funcione corretamente, o backend deve responder ao endpoint /chat com JSON contendo pelo menos os campos "resposta" e "intencao" (opcional).

## Licenca

Projeto academico, sem fins comerciais. Desenvolvido para a disciplina Linguagem de Programacao III.
