# API TaskyXPandz for Business

Backend em Node.js + Express. Responde JSON.

## Rodar

```powershell
cd backend
npm install
npm run dev
```

Sem `DATABASE_URL`, a API usa **SQLite** no arquivo `backend/dados.sqlite`. Os dados persistem mesmo ao reiniciar.

Com `DATABASE_URL`, usa **PostgreSQL**.

## Variaveis de ambiente

Copie `.env.example` para `.env` e ajuste:

- `PORT` - porta da API (padrao 3001)
- `FRONTEND_URL` - origem liberada no CORS
- `JWT_SECRET` - segredo dos tokens (troque antes de publicar)
- `DATABASE_URL` - conexao do PostgreSQL (vazio = SQLite)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` - e-mail real (vazio = modo dev)

Nunca commite o `.env`.

## Endpoints

- `GET /api/health` - status da API e do banco
- `GET /api/tarefas` - lista tarefas
- `POST /api/tarefas` - cria tarefa
- `PATCH /api/tarefas/:id/status` - altera status
- `DELETE /api/tarefas/:id` - exclui tarefa
- `POST /api/auth/solicitar-codigo` - envia codigo por e-mail (sem senha)
- `POST /api/auth/verificar` - troca codigo pelo JWT
- `GET /api/me` - dados do usuario autenticado

## Seguranca

- Helmet (cabecalhos)
- CORS limitado a uma origem
- Rate limit
- Validacao de entrada
- Queries SQL parametrizadas
- Senha nao e armazenada (login por codigo)
- `.env` fora do Git
