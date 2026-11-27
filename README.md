# TaskyXPandz for Business

> Work Smarter. Grow Further.

A small SaaS for managing **tasks, teams, deadlines and reports**, with **passwordless login** (email → code → in).

---

## What it does

- Dashboard with task indicators
- Tasks: create, change status, delete
- Teams: add and remove members
- Reports: totals, completion rate, by owner
- Profile and settings (company, language, theme)
- Light/dark theme and PT/EN translation
- Login by code — no password stored

---

## Stack

- Frontend: HTML, CSS, JavaScript (no framework)
- Backend: Node.js + Express
- Database: SQLite (built into Node); PostgreSQL via `DATABASE_URL`
- Auth: JWT + one-time code (Nodemailer for real email, optional)
- Security: Helmet, CORS, rate limit, input validation, parameterized SQL
- Tools: Git, VS Code, Live Server

---

## Run locally

```powershell
cd backend
npm install
npm.cmd run dev
```

> On Windows PowerShell, use `npm.cmd` — `npm.ps1` may be blocked by script policy.

API: `http://127.0.0.1:3001/api/health` → `{"status":"ok","modo":"sqlite"}`

Frontend: right-click `frontend/pages/login.html` → **Open with Live Server**.

Open `http://127.0.0.1:5500/frontend/pages/login.html`.

Use any email (e.g. `matt@acme.com`). In dev mode the code appears on screen. Press **Ctrl+F5** if you see an old page.

---

## Structure

```text
backend/
  server.js        # API, database, auth
  .env.example     # config template (no secrets)
frontend/
  pages/           # login, dashboard, tasks, teams, reports, settings, profile
  css/             # variables, base, layout
  js/
    i18n.js        # PT/EN dictionary
    sidebar.js     # menu generated once
    auth.js        # session + profile menu
    api.js         # fetch helpers
    tasks.js       # table rendering
    login.js       # code flow
    equipes.js, relatorios.js, configuracoes.js, perfil.js
dados.sqlite       # created automatically (ignored by Git)
```

---

## API

| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | API status |
| GET/POST | `/api/tarefas` | List / create task |
| PATCH | `/api/tarefas/:id/status` | Change status |
| DELETE | `/api/tarefas/:id` | Delete task |
| POST | `/api/auth/solicitar-codigo` | Send code |
| POST | `/api/auth/verificar` | Exchange code for JWT |
| GET | `/api/me` | Current user |

---

## How it works

1. Frontend calls the API first; if it is down, it falls back to `localStorage`.
2. The API saves tasks in SQLite with parameterized SQL.
3. Login: an 8-character code is generated (15 min expiry) and exchanged for a 7-day JWT.
4. The profile menu is a single avatar button: view/edit profile, language, theme, sign out.
5. Tables are built with `createElement` + `textContent` (no `innerHTML` with user data).
6. `Acme Studio` is just a fictional default company — editable in the UI.

---

## Interview notes

**What is it?** A small task-management SaaS with passwordless access.

**Why passwordless?** No password to store or leak; the code is temporary.

**How is the frontend organized?** One JS file per responsibility; the sidebar is generated once.

**Where is data stored?** API → SQLite; `localStorage` as fallback.

**What did you learn?** Splitting responsibilities, `fetch`, JWT, validation, and basic security.

**Next steps:** real SMTP email, PostgreSQL in production, real multi-tenant.

---

## Status

- [x] Frontend, theme, PT/EN
- [x] REST API, login by code, SQLite
- [x] Profile, teams, reports, settings
- [ ] Real email (SMTP)
- [ ] PostgreSQL in production
- [ ] Multi-tenant

**Author:** Matt C · https://github.com/mattxcreativework
