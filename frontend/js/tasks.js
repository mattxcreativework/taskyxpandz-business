const tarefas = [
  { titulo: "Revisar proposta comercial", responsavel: "Ana Souza", prazo: "28/11", status: "andamento" },
  { titulo: "Atualizar relatório mensal", responsavel: "Carlos Lima", prazo: "25/11", status: "atrasada" },
  { titulo: "Reunião de alinhamento", responsavel: "Marina Alves", prazo: "24/11", status: "concluida" },
  { titulo: "Preparar apresentação", responsavel: "Ana Souza", prazo: "30/11", status: "andamento" },
  { titulo: "Revisar contrato", responsavel: "Pedro Dias", prazo: "22/11", status: "concluida" },
];

const rotulos = {
  andamento: "Em andamento",
  concluida: "Concluída",
  atrasada: "Atrasada",
};

function contar(status) {
  return tarefas.filter((t) => t.status === status).length;
}

function renderizar() {
  const corpo = document.getElementById("tasks-body");
  corpo.innerHTML = tarefas
    .map(
      (t) => `
    <tr>
      <td>${t.titulo}</td>
      <td>${t.responsavel}</td>
      <td>${t.prazo}</td>
      <td><span class="badge ${t.status}">${rotulos[t.status]}</span></td>
    </tr>`
    )
    .join("");

  document.getElementById("stat-ativas").textContent = contar("andamento");
  document.getElementById("stat-concluidas").textContent = contar("concluida");
  document.getElementById("stat-atrasadas").textContent = contar("atrasada");
}
renderizar();
document.getElementById("task-form").addEventListener("submit", (e) => {
  e.preventDefault();
  tarefas.push({
    titulo: document.getElementById("task-title").value,
    responsavel: document.getElementById("task-owner").value,
    prazo: document.getElementById("task-date").value,
    status: "andamento",
  });
  e.target.reset();
  renderizar();
});