const CHAVE_TAREFAS = "tasky-business-tarefas";

const padrao = [
  { titulo: "Revisar proposta comercial", responsavel: "Ana Souza", prazo: "28/11", status: "andamento" },
  { titulo: "Atualizar relatório mensal", responsavel: "Carlos Lima", prazo: "25/11", status: "atrasada" },
  { titulo: "Reunião de alinhamento", responsavel: "Marina Alves", prazo: "24/11", status: "concluida" },
  { titulo: "Preparar apresentação", responsavel: "Ana Souza", prazo: "30/11", status: "andamento" },
  { titulo: "Revisar contrato", responsavel: "Pedro Dias", prazo: "22/11", status: "concluida" },
];

let tarefas = [];
let usandoApi = false;
let proximoIdLocal = 1000;

const rotulos = {
  andamento: "Em andamento",
  concluida: "Concluída",
  atrasada: "Atrasada",
};

const ordem = ["andamento", "concluida", "atrasada"];

function salvarLocal() {
  localStorage.setItem(CHAVE_TAREFAS, JSON.stringify(tarefas));
}

function normalizar(lista) {
  return lista.map((tarefa, indice) => ({
    ...tarefa,
    id: tarefa.id || indice + 1,
  }));
}

async function carregar() {
  try {
    tarefas = normalizar(await apiListar());
    usandoApi = true;
  } catch {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_TAREFAS));
    tarefas = normalizar(salvo || padrao);
    usandoApi = false;
  }

  proximoIdLocal = Math.max(0, ...tarefas.map((tarefa) => Number(tarefa.id) || 0)) + 1;
  salvarLocal();
  renderizar();
}

function contar(status) {
  return tarefas.filter((tarefa) => tarefa.status === status).length;
}

function renderizar() {
  const corpo = document.getElementById("tasks-body");
  corpo.replaceChildren();

  tarefas.forEach((tarefa, indice) => {
    const linha = document.createElement("tr");

    const titulo = document.createElement("td");
    titulo.textContent = tarefa.titulo;

    const responsavel = document.createElement("td");
    responsavel.textContent = tarefa.responsavel;

    const prazo = document.createElement("td");
    prazo.textContent = tarefa.prazo;

    const status = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `badge ${tarefa.status}`;
    badge.dataset.i18n = `badge.${tarefa.status}`;
    badge.textContent = rotulos[tarefa.status];
    status.appendChild(badge);

    const acoes = document.createElement("td");
    const btnStatus = document.createElement("button");
    btnStatus.className = "btn-status";
    btnStatus.dataset.i = indice;
    btnStatus.dataset.i18n = "acao.status";
    btnStatus.textContent = "Mudar status";

    const btnDel = document.createElement("button");
    btnDel.className = "btn-del";
    btnDel.dataset.i = indice;
    btnDel.dataset.i18n = "acao.excluir";
    btnDel.textContent = "Excluir";

    acoes.append(btnStatus, btnDel);
    linha.append(titulo, responsavel, prazo, status, acoes);
    corpo.appendChild(linha);
  });

  const stats = {
    "stat-ativas": "andamento",
    "stat-concluidas": "concluida",
    "stat-atrasadas": "atrasada",
  };
  for (const id in stats) {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = contar(stats[id]);
  }

  if (typeof aplicarIdioma === "function") aplicarIdioma(idiomaAtual);
}

document.getElementById("task-form").addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const dados = {
    titulo: document.getElementById("task-title").value,
    responsavel: document.getElementById("task-owner").value,
    prazo: document.getElementById("task-date").value,
  };

  try {
    if (usandoApi) {
      tarefas.push(await apiCriar(dados));
    } else {
      tarefas.push({ id: proximoIdLocal++, ...dados, status: "andamento" });
    }
  } catch {
    tarefas.push({ id: proximoIdLocal++, ...dados, status: "andamento" });
    usandoApi = false;
  }

  salvarLocal();
  evento.target.reset();
  renderizar();
});

document.getElementById("tasks-body").addEventListener("click", async (evento) => {
  const indice = Number(evento.target.dataset.i);
  const tarefa = tarefas[indice];
  if (!tarefa) return;

  if (evento.target.classList.contains("btn-del")) {
    if (usandoApi && tarefa.id) {
      try {
        await apiExcluir(tarefa.id);
      } catch {
        usandoApi = false;
      }
    }
    tarefas.splice(indice, 1);
    salvarLocal();
    renderizar();
  }

  if (evento.target.classList.contains("btn-status")) {
    const atual = ordem.indexOf(tarefa.status);
    const proximo = ordem[(atual + 1) % ordem.length];

    if (usandoApi && tarefa.id) {
      try {
        await apiAlterarStatus(tarefa.id, proximo);
      } catch {
        usandoApi = false;
      }
    }

    tarefa.status = proximo;
    salvarLocal();
    renderizar();
  }
});

carregar();
