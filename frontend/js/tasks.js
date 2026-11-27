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

const ordem = ["andamento", "concluida", "atrasada"];

function contar(status) {
  return tarefas.filter((t) => t.status === status).length;
}

function renderizar() {
  const corpo = document.getElementById("tasks-body");
  corpo.replaceChildren();

  tarefas.forEach((t, i) => {
    const linha = document.createElement("tr");

    const titulo = document.createElement("td");
    titulo.textContent = t.titulo;

    const responsavel = document.createElement("td");
    responsavel.textContent = t.responsavel;

    const prazo = document.createElement("td");
    prazo.textContent = t.prazo;

    const status = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `badge ${t.status}`;
    badge.dataset.i18n = `badge.${t.status}`;
    badge.textContent = rotulos[t.status];
    status.appendChild(badge);

    const acoes = document.createElement("td");
    const btnStatus = document.createElement("button");
    btnStatus.className = "btn-status";
    btnStatus.dataset.i = i;
    btnStatus.dataset.i18n = "acao.status";
    btnStatus.textContent = "Mudar status";

    const btnDel = document.createElement("button");
    btnDel.className = "btn-del";
    btnDel.dataset.i = i;
    btnDel.dataset.i18n = "acao.excluir";
    btnDel.textContent = "Excluir";

    acoes.append(btnStatus, btnDel);
    linha.append(titulo, responsavel, prazo, status, acoes);
    corpo.appendChild(linha);
  });

  const stats = { "stat-ativas": "andamento", "stat-concluidas": "concluida", "stat-atrasadas": "atrasada" };
  for (const id in stats) {
    const el = document.getElementById(id);
    if (el) el.textContent = contar(stats[id]);
  }

  if (typeof aplicarIdioma === "function") aplicarIdioma(idiomaAtual);
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
  const i = Number(e.target.dataset.i);

  if (e.target.classList.contains("btn-del")) {
    tarefas.splice(i, 1);
    salvar();
    renderizar();
  }

  if (e.target.classList.contains("btn-status")) {
    const atual = ordem.indexOf(tarefas[i].status);
    tarefas[i].status = ordem[(atual + 1) % ordem.length];
    salvar();
    renderizar();
  }
});