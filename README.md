# frontend_AV2

Projeto da AV2 de Linguagem de Programação III, desenvolvido como um portal web de vagas de emprego com frontend em HTML, CSS e JavaScript e automação RPA para envio de notificações por WhatsApp e Gmail. A atividade exige um frontend dinâmico consumindo API REST, além de um script funcional para envio real de mensagens por WhatsApp Web e Gmail, com tratamento de erros e registro de logs.

## Estrutura

```text
frontend_AV2/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   ├── api.js
│   └── app.js
├── rpa/
│   ├── enviar_whatsapp.py
│   ├── enviar_email.py
│   ├── logger_utils.py
│   └── requirements.txt
└── logs/
```

## Objetivo do projeto

Este projeto implementa a base de um portal de vagas contextualizado para a disciplina, com integração entre interface web e backend em Python exposto por API REST. O frontend foi preparado para publicação no GitHub Pages, enquanto os scripts Python de automação foram mantidos para execução local, já que o GitHub Pages hospeda apenas arquivos estáticos.

## Frontend

O frontend atende ao requisito de interface funcional com consumo real da API e filtro de vagas por múltiplos critérios. A aplicação já inclui:

- listagem de vagas vindas da API;
- filtro por área;
- filtro por modalidade;
- busca textual;
- teste de conexão com o backend;
- candidatura de teste com criação de candidato e posterior inscrição na vaga.

### Fluxo de candidatura

Para ficar alinhado com a modelagem exigida pela atividade, o frontend realiza a candidatura em duas etapas:

1. envia os dados do candidato para `POST /candidatos`;
2. recebe o `id` do candidato criado;
3. envia `candidato_id` e `vaga_id` para `POST /inscricoes`.

Esse fluxo respeita a separação entre as entidades `Candidato`, `Vaga` e `Inscricao`, conforme os requisitos mínimos da avaliação.

### Configuração da API

Edite `js/config.js` e troque a URL de exemplo pelo link atual do ngrok:

```javascript
const API_BASE_URL = "https://SEU-LINK-NGROK.ngrok-free.app";
```

Os endpoints atualmente utilizados pelo frontend são:

```javascript
const API_ENDPOINTS = {
  vagas: "/vagas",
  health: "/",
  candidatos: "/candidatos",
  candidatura: "/inscricoes"
};
```

### Endpoints esperados no backend

Para o frontend funcionar corretamente, o backend deve disponibilizar os seguintes endpoints JSON:

| Método | Endpoint | Finalidade |
|---|---|---|
| GET | `/vagas` | Listar vagas para exibição no portal |
| POST | `/candidatos` | Criar um candidato |
| POST | `/inscricoes` | Registrar a inscrição vinculando candidato e vaga |
| GET | `/` | Teste simples de conexão com a API |

## Publicação no GitHub Pages

A atividade aceita entrega por link público do GitHub, então este frontend pode ser publicado diretamente no GitHub Pages.

### Passos

1. Crie um repositório no GitHub.
2. Envie os arquivos do projeto.
3. No repositório, vá em **Settings > Pages**.
4. Escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/root`.
6. Aguarde a geração da URL pública.

## Execução local do frontend

Como o projeto é estático, o `index.html` pode ser aberto diretamente no navegador. Mesmo assim, para evitar limitações locais, é recomendável utilizar um servidor simples.

Exemplo com Python:

```bash
python -m http.server 5500
```

Acesse:

```text
http://localhost:5500
```

## Scripts RPA

Os scripts de automação foram preparados para cumprir o requisito de envio real via WhatsApp Web e Gmail, com tratamento de erros e geração de logs, conforme os critérios da atividade.

### Instalação das dependências

Entre na pasta `rpa` e instale os pacotes:

```bash
pip install -r requirements.txt
```

### Logs

O arquivo `logger_utils.py` cria automaticamente a pasta `logs/` e grava os arquivos de log da automação. Isso ajuda a registrar sucesso ou falha dos envios, algo explicitamente cobrado na avaliação.

## WhatsApp

O script `enviar_whatsapp.py` usa `PyWhatKit` para abrir o WhatsApp Web e disparar uma mensagem para um número válido, conforme exigido pela atividade.

### Exemplo de uso

```bash
python enviar_whatsapp.py --numero +5548999999999 --nome "Aluno Teste" --vaga "Assistente Administrativo" --empresa "Empresa Exemplo" --link "https://exemplo.com/vaga"
```

### Observações importantes

- O número deve estar no formato internacional.
- O WhatsApp Web precisa abrir corretamente no navegador.
- É recomendável já estar logado no WhatsApp Web antes da demonstração.
- Em alguns computadores, o carregamento pode ser mais lento, então o parâmetro `--esperar` pode ser aumentado.

Exemplo com espera maior:

```bash
python enviar_whatsapp.py --numero +5548999999999 --nome "Aluno Teste" --vaga "Assistente Administrativo" --empresa "Empresa Exemplo" --esperar 30
```

## E-mail com Gmail

O script `enviar_email.py` usa `smtplib` com o servidor SMTP do Gmail, o que atende ao requisito de automação por e-mail previsto no projeto.

### Arquivo `.env`

Crie um arquivo `.env` dentro da pasta `rpa/` com as credenciais:

```env
EMAIL_REMETENTE=seuemail@gmail.com
EMAIL_SENHA_APP=sua_senha_de_app
```

### Exemplo de uso

```bash
python enviar_email.py --destinatario aluno.teste@email.com --nome "Aluno Teste" --vaga "Assistente Administrativo" --empresa "Empresa Exemplo" --link "https://exemplo.com/vaga"
```

### Observações importantes

- Para Gmail, o ideal é usar **senha de aplicativo**, não a senha normal da conta.
- A conta pode exigir autenticação em duas etapas para gerar essa senha.
- Faça um teste antes da apresentação para evitar bloqueios de segurança.

## CORS no backend

Como o frontend e o backend estarão em domínios diferentes, o Flask precisa permitir CORS para o GitHub Pages acessar a API corretamente. Sem isso, o navegador pode bloquear as requisições mesmo com a API online.

Exemplo no Flask:

```python
from flask_cors import CORS
CORS(app)
```

## JSON esperado no endpoint de vagas

O frontend aceita tanto uma lista direta quanto um objeto contendo a chave `vagas`.

### Exemplo 1

```json
[
  {
    "id": 1,
    "titulo": "Assistente Administrativo",
    "empresa": "Empresa Exemplo",
    "descricao": "Apoio a processos administrativos.",
    "area": "Administrativo",
    "modalidade": "Presencial",
    "local": "Palhoça - SC",
    "salario": "R$ 2.200,00",
    "link": "https://exemplo.com/vaga"
  }
]
```

### Exemplo 2

```json
{
  "vagas": [
    {
      "id": 1,
      "titulo": "Assistente Administrativo",
      "empresa": "Empresa Exemplo"
    }
  ]
}
```

## JSON esperado no endpoint de candidatos

O endpoint `/candidatos` deve aceitar um JSON como este:

```json
{
  "nome": "Maria Eduarda Schmidt",
  "email": "maria@example.com",
  "telefone": "48999999999"
}
```

Resposta esperada:

```json
{
  "mensagem": "Candidato criado com sucesso!",
  "id": 1
}
```

## JSON esperado no endpoint de inscrições

Após criar o candidato, o frontend envia a inscrição com `candidato_id` e `vaga_id`:

```json
{
  "candidato_id": 1,
  "vaga_id": 2
}
```

Resposta esperada:

```json
{
  "mensagem": "Inscrição realizada com sucesso!",
  "id": 10
}
```

## Entrega e apresentação

A atividade pede demonstração em tempo real do portal e prova de envio real de WhatsApp e e-mail para um contato válido da turma-alvo. Por isso, a melhor estratégia é:

- publicar o frontend no GitHub Pages;
- deixar o backend ativo no ngrok;
- testar CORS e endpoints antes da apresentação;
- validar o fluxo `candidatos -> inscricoes` antes da banca;
- deixar o WhatsApp Web já autenticado;
- deixar o `.env` pronto para o envio do Gmail;
- executar os scripts RPA localmente no momento da prova.

## Comandos úteis

### Subir o projeto para o GitHub

```bash
git init
git add .
git commit -m "feat: integração frontend com API REST da AV2"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/frontend_AV2.git
git push -u origin main
```

### Instalar dependências dos scripts

```bash
cd rpa
pip install -r requirements.txt
```

## Melhorias futuras

Com base nos requisitos da atividade, esta base ainda pode evoluir para:

- formulário real de candidatura integrado ao backend;
- chatbot com fluxo de saudação, filtro e candidatura;
- tela de cadastro de candidato com validação visual;
- integração do frontend com logs de automação;
- templates mais ricos de mensagem;
- tela administrativa para disparar notificações.
