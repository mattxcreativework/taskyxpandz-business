const API_URL = "http://127.0.0.1:3001/api";

async function apiListar() {
  const resposta = await fetch(`${API_URL}/tarefas`);
  if (!resposta.ok) throw new Error("Falha ao listar tarefas");
  return resposta.json();
}

async function apiCriar(dados) {
  const resposta = await fetch(`${API_URL}/tarefas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) throw new Error("Falha ao criar tarefa");
  return resposta.json();
}

async function apiAlterarStatus(id, status) {
  const resposta = await fetch(`${API_URL}/tarefas/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!resposta.ok) throw new Error("Falha ao alterar status");
  return resposta.json();
}

async function apiExcluir(id) {
  const resposta = await fetch(`${API_URL}/tarefas/${id}`, {
    method: "DELETE",
  });
  if (!resposta.ok) throw new Error("Falha ao excluir tarefa");
}
