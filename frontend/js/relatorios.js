const tarefasRelatorio = JSON.parse(
  localStorage.getItem("tasky-business-tarefas") || "[]"
);

function contarRelatorio(status) {
  return tarefasRelatorio.filter((tarefa) => tarefa.status === status).length;
}

function definirTexto(id, valor) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.textContent = valor;
}

const total = tarefasRelatorio.length;
const andamento = contarRelatorio("andamento");
const concluidas = contarRelatorio("concluida");
const atrasadas = contarRelatorio("atrasada");
const taxa = total ? Math.round((concluidas / total) * 100) : 0;

definirTexto("rel-total", total);
definirTexto("rel-andamento", andamento);
definirTexto("rel-concluidas", concluidas);
definirTexto("rel-atrasadas", atrasadas);
definirTexto("rel-taxa", `${taxa}%`);

const barras = document.getElementById("rel-barras");
[
  { chave: "badge.andamento", valor: andamento, classe: "andamento" },
  { chave: "badge.concluida", valor: concluidas, classe: "concluida" },
  { chave: "badge.atrasada", valor: atrasadas, classe: "atrasada" },
].forEach((item) => {
  const linha = document.createElement("div");
  linha.className = "barra-linha";

  const rotulo = document.createElement("span");
  rotulo.dataset.i18n = item.chave;
  rotulo.textContent = traduzir(item.chave);

  const trilha = document.createElement("div");
  trilha.className = "barra";

  const preenchimento = document.createElement("div");
  preenchimento.className = `barra-preenchimento ${item.classe}`;
  preenchimento.style.width = `${total ? (item.valor / total) * 100 : 0}%`;

  const numero = document.createElement("strong");
  numero.textContent = item.valor;

  trilha.appendChild(preenchimento);
  linha.append(rotulo, trilha, numero);
  barras.appendChild(linha);
});

const porResponsavel = {};
tarefasRelatorio.forEach((tarefa) => {
  porResponsavel[tarefa.responsavel] = (porResponsavel[tarefa.responsavel] || 0) + 1;
});

const responsaveis = document.getElementById("rel-responsaveis");
Object.entries(porResponsavel).forEach(([nome, quantidade]) => {
  const item = document.createElement("div");
  item.className = "responsavel-linha";

  const texto = document.createElement("span");
  texto.textContent = nome;

  const valor = document.createElement("strong");
  valor.textContent = quantidade;

  item.append(texto, valor);
  responsaveis.appendChild(item);
});
