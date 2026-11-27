require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Pool } = require("pg");

const app = express();

const PORT = Number(process.env.PORT) || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "dev-only-change-me";
const ORIGEM_PERMITIDA = process.env.FRONTEND_URL || "http://127.0.0.1:5500";
const USAR_POSTGRES = Boolean(process.env.DATABASE_URL);

if (JWT_SECRET === "dev-only-change-me") {
  console.warn("AVISO: defina JWT_SECRET no .env antes de ir para producao.");
}

app.use(helmet());
app.use(cors({ origin: ORIGEM_PERMITIDA }));
app.use(express.json({ limit: "16kb" }));
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const pool = USAR_POSTGRES
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

const STATUS_PERMITIDOS = ["andamento", "concluida", "atrasada"];

let tarefasMemoria = [
  { id: 1, titulo: "Revisar proposta comercial", responsavel: "Ana Souza", prazo: "28/11", status: "andamento" },
  { id: 2, titulo: "Atualizar relatorio mensal", responsavel: "Carlos Lima", prazo: "25/11", status: "atrasada" },
  { id: 3, titulo: "Reuniao de alinhamento", responsavel: "Marina Alves", prazo: "24/11", status: "concluida" },
];
let proximoId = tarefasMemoria.length + 1;

async function inicializarBanco() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id SERIAL PRIMARY KEY,
      titulo TEXT NOT NULL,
      responsavel TEXT NOT NULL,
      prazo TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'andamento',
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function validarTarefa(corpo) {
  const titulo = String(corpo.titulo || "").trim();
  const responsavel = String(corpo.responsavel || "").trim();
  const prazo = String(corpo.prazo || "").trim();

  if (!titulo || titulo.length > 120) return null;
  if (!responsavel || responsavel.length > 80) return null;
  if (!prazo || prazo.length > 30) return null;

  return { titulo, responsavel, prazo };
}

async function listarTarefas() {
  if (pool) {
    const resultado = await pool.query(
      "SELECT id, titulo, responsavel, prazo, status FROM tarefas ORDER BY id"
    );
    return resultado.rows;
  }
  return tarefasMemoria;
}

async function criarTarefa(dados) {
  if (pool) {
    const resultado = await pool.query(
      "INSERT INTO tarefas (titulo, responsavel, prazo, status) VALUES ($1, $2, $3, $4) RETURNING id, titulo, responsavel, prazo, status",
      [dados.titulo, dados.responsavel, dados.prazo, "andamento"]
    );
    return resultado.rows[0];
  }

  const tarefa = { id: proximoId++, ...dados, status: "andamento" };
  tarefasMemoria.push(tarefa);
  return tarefa;
}

async function atualizarStatus(id, status) {
  if (pool) {
    const resultado = await pool.query(
      "UPDATE tarefas SET status = $1 WHERE id = $2 RETURNING id, titulo, responsavel, prazo, status",
      [status, id]
    );
    return resultado.rows[0] || null;
  }

  const tarefa = tarefasMemoria.find((item) => item.id === Number(id));
  if (!tarefa) return null;
  tarefa.status = status;
  return tarefa;
}

async function excluirTarefa(id) {
  if (pool) {
    const resultado = await pool.query("DELETE FROM tarefas WHERE id = $1", [id]);
    return resultado.rowCount > 0;
  }

  const indice = tarefasMemoria.findIndex((item) => item.id === Number(id));
  if (indice === -1) return false;
  tarefasMemoria.splice(indice, 1);
  return true;
}

const rota = (funcao) => (req, res, proximo) =>
  Promise.resolve(funcao(req, res, proximo)).catch(proximo);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    modo: pool ? "postgres" : "memoria",
    agora: new Date().toISOString(),
  });
});

app.get("/api/tarefas", rota(async (req, res) => {
  res.json(await listarTarefas());
}));

app.post("/api/tarefas", rota(async (req, res) => {
  const dados = validarTarefa(req.body || {});
  if (!dados) {
    return res.status(400).json({ erro: "titulo, responsavel e prazo sao obrigatorios" });
  }
  const tarefa = await criarTarefa(dados);
  res.status(201).json(tarefa);
}));

app.patch("/api/tarefas/:id/status", rota(async (req, res) => {
  const status = String(req.body.status || "");
  if (!STATUS_PERMITIDOS.includes(status)) {
    return res.status(400).json({ erro: "status invalido" });
  }
  const tarefa = await atualizarStatus(req.params.id, status);
  if (!tarefa) return res.status(404).json({ erro: "tarefa nao encontrada" });
  res.json(tarefa);
}));

app.delete("/api/tarefas/:id", rota(async (req, res) => {
  const removida = await excluirTarefa(req.params.id);
  if (!removida) return res.status(404).json({ erro: "tarefa nao encontrada" });
  res.status(204).send();
}));

const linksMagic = new Map();

app.post("/api/auth/solicitar-link", rota(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ erro: "e-mail invalido" });
  }

  const token = crypto.randomBytes(24).toString("hex");
  linksMagic.set(email, { token, expira: Date.now() + 15 * 60 * 1000 });

  // Em producao, enviar e-mail. Em desenvolvimento, o token volta na resposta.
  res.json({ mensagem: "Link enviado", token });
}));

app.post("/api/auth/verificar", rota(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const token = String(req.body.token || "");
  const registro = linksMagic.get(email);

  if (!registro || registro.token !== token || registro.expira < Date.now()) {
    return res.status(401).json({ erro: "link invalido ou expirado" });
  }

  linksMagic.delete(email);
  const jwtToken = jwt.sign({ email, empresa: "Acme Studio" }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token: jwtToken, usuario: { email, empresa: "Acme Studio" } });
}));

function autenticar(req, res, proximo) {
  const cabecalho = req.headers.authorization || "";
  const token = cabecalho.startsWith("Bearer ") ? cabecalho.slice(7) : null;

  if (!token) return res.status(401).json({ erro: "token ausente" });

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    proximo();
  } catch {
    res.status(401).json({ erro: "token invalido" });
  }
}

app.get("/api/me", autenticar, (req, res) => {
  res.json(req.usuario);
});

app.use((erro, req, res, proximo) => {
  console.error(erro);
  res.status(500).json({ erro: "erro interno do servidor" });
});

inicializarBanco()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API TaskyXPandz rodando na porta ${PORT}`);
      console.log(`Modo: ${pool ? "PostgreSQL" : "memoria (sem DATABASE_URL)"}`);
    });
  })
  .catch((erro) => {
    console.error("Falha ao iniciar o banco:", erro);
    process.exit(1);
  });
