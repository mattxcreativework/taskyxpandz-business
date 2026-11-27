# TaskyXPandz for Business

> Work Smarter. Grow Further.

SaaS empresarial para organizar **tarefas, equipes, prazos, relatórios e preferências**, com acesso **sem senha** (o usuário entra com um código enviado por e-mail).

Projeto de portfólio feito em camadas: primeiro o front, depois a API, depois o banco e o login.

---

## Status

✅ Versão 1 funcional.

- Frontend completo (5 páginas + login + perfil)
- API REST em Node/Express
- Banco SQLite local (e suporte a PostgreSQL via `DATABASE_URL`)
- Login por código, sem senha
- Tema claro/escuro
- Português e inglês

---

## Tecnologias

### Usadas hoje

- **HTML + CSS + JavaScript** no frontend
- **Node.js + Express** na API
- **SQLite** (embutido no Node) para persistir dados
- **JWT** para manter o usuário logado
- **Nodemailer** para e-mail (opcional; em dev o código aparece na tela)
- **Git + GitHub**
- **VS Code + Live Server**

### Preparadas para o futuro

- **PostgreSQL** (basta preencher `DATABASE_URL`)
- Multi-tenant real (hoje a empresa é fictícia: `Acme Studio`)
- Notificações e histórico de acessos

---

## Como rodar local

### 1. Pré-requisitos

- Node.js 20 ou newer (foi testado com Node 26)
- VS Code com a extensão **Live Server**
- Git

### 2. Backend (API)

Abra um terminal na pasta do projeto:

```powershell
cd backend
npm install
npm run dev
```

A API sobe em:

```text
http://127.0.0.1:3001/api/health
```

Se aparecer `{"status":"ok","modo":"sqlite"}`, está certo. ✅

### 3. Frontend

No VS Code:

1. Abra a pasta `taskyxpandz-business`
2. Botão direito em `frontend/pages/login.html`
3. **Open with Live Server**

Acesso:

```text
http://127.0.0.1:5500/frontend/pages/login.html
```

> Se o navegador mostrar tela antiga, aperte **Ctrl+F5** (reload forçado). Isso aconteceu muito durante o desenvolvimento.

---

## Como usar

1. Digite qualquer e-mail (ex.: `matt@acme.com`)
2. Clique em **Enviar código**
3. Em modo dev, o código aparece preenchido na tela
4. Clique em **Entrar**
5. Você cai no Dashboard

Na topbar fica só a **bolinha do perfil**. Clicando nela:

- Ver perfil
- Editar perfil
- Idioma (PT/EN)
- Modo claro/escuro
- Sair

---

## Estrutura de pastas

```text
taskyxpandz-business/
├── backend/
│   ├── server.js          # API, rotas, banco, login
│   ├── package.json       # dependências e scripts
│   ├── .env.example       # modelo de variáveis (sem segredos)
│   ├── README.md          # docs da API
│   └── dados.sqlite       # criado automaticamente (ignorado no Git)
├── frontend/
│   ├── pages/
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── tarefas.html
│   │   ├── equipes.html
│   │   ├── relatorios.html
│   │   ├── configuracoes.html
│   │   └── perfil.html
│   ├── css/
│   │   ├── variables.css  # paleta e temas
│   │   ├── base.css
│   │   └── layout.css     # sidebar, cards, tabela, menu do perfil
│   ├── js/
│   │   ├── i18n.js        # dicionário PT/EN + botões de idioma
│   │   ├── sidebar.js     # menu lateral gerado por JS
│   │   ├── theme.js       # tema claro/escuro
│   │   ├── auth.js        # sessão, bolinha do perfil, logout
│   │   ├── login.js       # envio e verificação do código
│   │   ├── api.js         # chamadas fetch para a API
│   │   ├── tasks.js       # tarefas (API + fallback local)
│   │   ├── equipes.js
│   │   ├── relatorios.js
│   │   ├── configuracoes.js
│   │   └── perfil.js
│   └── assets/logo/symbol.svg
├── docs/
├── .gitignore
└── README.md
```

---

## O que cada arquivo faz

| Arquivo | Função principal |
|---|---|
| `server.js` | Cria a API, valida dados, salva no banco e gera o JWT |
| `.env.example` | Mostra quais variáveis existem sem vazar segredos |
| `i18n.js` | Traduz textos com `data-i18n` e `data-i18n-placeholder` |
| `sidebar.js` | Cria o menu lateral uma vez, em vez de repetir nos 6 HTMLs |
| `auth.js` | Valida o token no `/api/me` e monta o menu da bolinha |
| `login.js` | Pede o código e troca o código pelo token |
| `api.js` | Centraliza `fetch` para listar/criar/excluir tarefas |
| `tasks.js` | Renderiza a tabela com `createElement` + `textContent` |
| `equipes.js` | Adiciona/exclui equipes no `localStorage` |
| `relatorios.js` | Calcula indicadores a partir das tarefas |
| `configuracoes.js` | Salva empresa, idioma e tema |
| `perfil.js` | Mostra e edita nome/empresa |

---

## Decisões técnicas (o que vale explicar)

### 1. Menu lateral em um único JS

Em vez de copiar os 5 links em cada página, `sidebar.js` cria o menu.  
Se precisar mudar o menu, muda em **um** lugar.

### 2. Segurança na renderização

A tabela é montada com `document.createElement()` + `textContent`.  
Não usamos `innerHTML` com dados do usuário, evitando injeção de HTML.

### 3. Internacionalização com `data-i18n`

Cada texto ganha uma chave, por exemplo:

```html
<th data-i18n="tabela.responsavel">Responsável</th>
```

O `i18n.js` procura essa chave no dicionário PT/EN e troca o texto.

### 4. Evolução do armazenamento

1. Começou com `localStorage` (`tasky-business-tarefas`)
2. Depois apareceu a API (`/api/tarefas`)
3. Depois o SQLite (`backend/dados.sqlite`)

O front tenta a API primeiro. Se a API estiver desligada, ele usa o `localStorage`. Isso é um **fallback**.

### 5. Login sem senha

- `POST /api/auth/solicitar-codigo` gera um código de 8 caracteres
- `POST /api/auth/verificar` troca o código por um JWT
- O JWT fica no `localStorage` e é validado em `GET /api/me`

Sem senha para guardar, sem hash de senha para gerenciar.

### 6. Segurança básica

- Helmet (cabeçalhos HTTP)
- CORS limitado a `http://127.0.0.1:5500`
- Rate limit (100 requisições/minuto)
- Validação das entradas
- SQL parametrizado (sem concatenação)
- `.env` fora do Git

---

## Endpoints da API

| Método | Rota | O que faz |
|---|---|---|
| `GET` | `/api/health` | Status da API e do banco |
| `GET` | `/api/tarefas` | Lista tarefas |
| `POST` | `/api/tarefas` | Cria tarefa |
| `PATCH` | `/api/tarefas/:id/status` | Muda status |
| `DELETE` | `/api/tarefas/:id` | Exclui tarefa |
| `POST` | `/api/auth/solicitar-codigo` | Gera/envia o código |
| `POST` | `/api/auth/verificar` | Troca código por JWT |
| `GET` | `/api/me` | Dados do usuário logado |

---

## Variáveis de ambiente

Arquivo: `backend/.env` (copiar de `.env.example`)

```text
PORT=3001
FRONTEND_URL=http://127.0.0.1:5500
JWT_SECRET=valor-aleatorio
DATABASE_URL=          # vazio = SQLite; preenchido = PostgreSQL
SMTP_HOST=             # vazio = código aparece na resposta
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=
```

> Nunca commite o `.env`.

---

## Guia de estudo para entrevista

Se você for perguntado sobre este projeto, estas são as respostas curtas:

**“O que é o projeto?”**  
Um SaaS para empresas organizarem tarefas, equipes e prazos, com login por código em vez de senha.

**“Por que login sem senha?”**  
Reduz risco: não armazenamos senha. O usuário recebe um código temporário válido por 15 minutos.

**“Como você organizou o front?”**  
Separei por responsabilidade: `i18n` para idioma, `auth` para sessão, `api` para chamadas HTTP, `tasks` para a tabela. O menu lateral é gerado por um único arquivo JS.

**“Como os dados são salvos?”**  
O front chama a API; a API salva em SQLite. Se a API estiver fora, o front usa `localStorage` como fallback.

**“O que você aprendeu?”**  
Aprendi a dividir arquivos, usar `fetch`, validar dados no backend, trabalhar com token JWT e tomar cuidado com segurança básica (sem `innerHTML`, SQL parametrizado e `.env` fora do Git).

**“O que faria diferente / próximo?”**  
Configuraria o e-mail real com SMTP, usaria PostgreSQL em produção e adicionaria multi-tenant de verdade.

---

## Resposta pronta (em primeira pessoa)

> “Eu construí um SaaS chamado TaskyXPandz for Business. No início era só HTML, CSS e JavaScript com dados no localStorage. Depois eu criei uma API em Node/Express, liguei o front com fetch e passei a salvar em SQLite. Também adicionei login sem senha: o usuário informa o e-mail, recebe um código e troca esse código por um token JWT. Cuidei de segurança básica: validação no backend, SQL parametrizado, CORS limitado e arquivo .env fora do Git. O projeto tem tema claro/escuro, português/inglês, páginas de tarefas, equipes, relatórios e configurações. O que eu mais aprendi foi separar responsabilidades por arquivo e entender que frontend e backend conversam por JSON.”

---

## Próximos passos

- [x] Frontend com 5 páginas
- [x] Tema claro/escuro
- [x] PT/EN
- [x] API REST
- [x] Login por código
- [x] SQLite
- [x] Perfil, equipes, relatórios e configurações
- [ ] E-mail real (SMTP)
- [ ] PostgreSQL em produção
- [ ] Multi-tenant real
- [ ] Publicar no GitHub

---

**Autor:** Matt C  
**GitHub:** https://github.com/mattxcreativework
