const API_URL = "http://127.0.0.1:3001/api";

function exigirApi() {
  if (MODO_DEMO) throw new Error("modo demo sem API");
}

async function apiListar() {
  exigirApi();
  const resposta = await fetch(`${API_URL}/tarefas`);
  if (!resposta.ok) throw new Error("Falha ao listar tarefas");
  return resposta.json();
}

async function apiCriar(dados) {
  exigirApi();
  const resposta = await fetch(`${API_URL}/tarefas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) throw new Error("Falha ao criar tarefa");
  return resposta.json();
}

async function apiAlterarStatus(id, status) {
  exigirApi();
  const resposta = await fetch(`${API_URL}/tarefas/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!resposta.ok) throw new Error("Falha ao alterar status");
  return resposta.json();
}

async function apiExcluir(id) {
  exigirApi();
  const resposta = await fetch(`${API_URL}/tarefas/${id}`, {
    method: "DELETE",
  });
  if (!resposta.ok) throw new Error("Falha ao excluir tarefa");
}
