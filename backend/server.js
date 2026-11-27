require("dotenv").config();

const path = require("path");
const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Pool } = require("pg");
const { DatabaseSync } = require("node:sqlite");

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
const sqlite = pool ? null : new DatabaseSync(path.join(__dirname, "dados.sqlite"));

const STATUS_PERMITIDOS = ["andamento", "concluida", "atrasada"];

const tarefasPadrao = [
  { titulo: "Revisar proposta comercial", responsavel: "Ana Souza", prazo: "28/11", status: "andamento" },
  { titulo: "Atualizar relatorio mensal", responsavel: "Carlos Lima", prazo: "25/11", status: "atrasada" },
  { titulo: "Reuniao de alinhamento", responsavel: "Marina Alves", prazo: "24/11", status: "concluida" },
  { titulo: "Preparar apresentacao", responsavel: "Ana Souza", prazo: "30/11", status: "andamento" },
  { titulo: "Revisar contrato", responsavel: "Pedro Dias", prazo: "22/11", status: "concluida" },
];

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    })
  : null;

async function inicializarBanco() {
  if (pool) {
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
    const resultado = await pool.query("SELECT COUNT(*)::int AS total FROM tarefas");
    if (resultado.rows[0].total === 0) {
      for (const tarefa of tarefasPadrao) {
        await pool.query(
          "INSERT INTO tarefas (titulo, responsavel, prazo, status) VALUES ($1, $2, $3, $4)",
          [tarefa.titulo, tarefa.responsavel, tarefa.prazo, tarefa.status]
        );
      }
    }
    return;
  }

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      responsavel TEXT NOT NULL,
      prazo TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'andamento',
      criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const total = sqlite.prepare("SELECT COUNT(*) AS total FROM tarefas").get();
  if (total.total === 0) {
    const inserir = sqlite.prepare(
      "INSERT INTO tarefas (titulo, responsavel, prazo, status) VALUES (?, ?, ?, ?)"
    );
    for (const tarefa of tarefasPadrao) {
      inserir.run(tarefa.titulo, tarefa.responsavel, tarefa.prazo, tarefa.status);
    }
  }
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
  return sqlite
    .prepare("SELECT id, titulo, responsavel, prazo, status FROM tarefas ORDER BY id")
    .all();
}

async function criarTarefa(dados) {
  if (pool) {
    const resultado = await pool.query(
      "INSERT INTO tarefas (titulo, responsavel, prazo, status) VALUES ($1, $2, $3, $4) RETURNING id, titulo, responsavel, prazo, status",
      [dados.titulo, dados.responsavel, dados.prazo, "andamento"]
    );
    return resultado.rows[0];
  }

  const info = sqlite
    .prepare("INSERT INTO tarefas (titulo, responsavel, prazo, status) VALUES (?, ?, ?, ?)")
    .run(dados.titulo, dados.responsavel, dados.prazo, "andamento");

  return sqlite
    .prepare("SELECT id, titulo, responsavel, prazo, status FROM tarefas WHERE id = ?")
    .get(Number(info.lastInsertRowid));
}

async function atualizarStatus(id, status) {
  if (pool) {
    const resultado = await pool.query(
      "UPDATE tarefas SET status = $1 WHERE id = $2 RETURNING id, titulo, responsavel, prazo, status",
      [status, id]
    );
    return resultado.rows[0] || null;
  }

  const info = sqlite
    .prepare("UPDATE tarefas SET status = ? WHERE id = ?")
    .run(status, Number(id));
  if (info.changes === 0) return null;

  return sqlite
    .prepare("SELECT id, titulo, responsavel, prazo, status FROM tarefas WHERE id = ?")
    .get(Number(id));
}

async function excluirTarefa(id) {
  if (pool) {
    const resultado = await pool.query("DELETE FROM tarefas WHERE id = $1", [id]);
    return resultado.rowCount > 0;
  }
  const info = sqlite.prepare("DELETE FROM tarefas WHERE id = ?").run(Number(id));
  return info.changes > 0;
}

const rota = (funcao) => (req, res, proximo) =>
  Promise.resolve(funcao(req, res, proximo)).catch(proximo);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    modo: pool ? "postgres" : "sqlite",
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
  res.status(201).json(await criarTarefa(dados));
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

const linksCodigo = new Map();

app.post("/api/auth/solicitar-codigo", rota(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ erro: "e-mail invalido" });
  }

  const codigo = crypto.randomBytes(4).toString("hex").toUpperCase();
  linksCodigo.set(email, { codigo, expira: Date.now() + 15 * 60 * 1000 });

  const texto = `Seu codigo TaskyXPandz e: ${codigo}. Ele expira em 15 minutos.`;

  if (transporter) {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Seu codigo de acesso TaskyXPandz",
      text: texto,
    });
    return res.json({ mensagem: "Codigo enviado por e-mail", modo: "email" });
  }

  res.json({ mensagem: "Codigo gerado", codigo, modo: "dev" });
}));

app.post("/api/auth/verificar", rota(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const codigo = String(req.body.codigo || "").trim().toUpperCase();
  const registro = linksCodigo.get(email);

  if (!registro || registro.codigo !== codigo || registro.expira < Date.now()) {
    return res.status(401).json({ erro: "codigo invalido ou expirado" });
  }

  linksCodigo.delete(email);
  const token = jwt.sign({ email, empresa: "Acme Studio" }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, usuario: { email, empresa: "Acme Studio" } });
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
      console.log(`Banco: ${pool ? "PostgreSQL" : "SQLite (backend/dados.sqlite)"}`);
      console.log(`E-mail: ${transporter ? "SMTP configurado" : "modo dev (codigo na resposta)"}`);
    });
  })
  .catch((erro) => {
    console.error("Falha ao iniciar o banco:", erro);
    process.exit(1);
  });
