const padrao = [
  { titulo: "Revisar proposta comercial", responsavel: "Ana Souza", prazo: "28/11", status: "andamento" },
  { titulo: "Atualizar relatório mensal", responsavel: "Carlos Lima", prazo: "25/11", status: "atrasada" },
  { titulo: "Reunião de alinhamento", responsavel: "Marina Alves", prazo: "24/11", status: "concluida" },
  { titulo: "Preparar apresentação", responsavel: "Ana Souza", prazo: "30/11", status: "andamento" },
  { titulo: "Revisar contrato", responsavel: "Pedro Dias", prazo: "22/11", status: "concluida" },
];

const tarefas = JSON.parse(localStorage.getItem("tasky-business-tarefas")) || padrao;

function salvar() {
  localStorage.setItem("tasky-business-tarefas", JSON.stringify(tarefas));
}

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
        (t, i) => `  
    <tr>
      <td>${t.titulo}</td>
      <td>${t.responsavel}</td>
      <td>${t.prazo}</td>
              <td><span class="badge ${t.status}">${rotulos[t.status]}</span></td>
      <td><button class="btn-del" data-i="${i}">Excluir</button></td>
    </tr>`
    )
    .join("");

   const stats = { "stat-ativas": "andamento", "stat-concluidas": "concluida", "stat-atrasadas": "atrasada" };
  for (const id in stats) {
    const el = document.getElementById(id);
    if (el) el.textContent = contar(stats[id]);
  }
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
  salvar();
  e.target.reset();
  renderizar();
});
document.getElementById("tasks-body").addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-del")) {
    tarefas.splice(e.target.dataset.i, 1);
    salvar();
    renderizar();
  }
});