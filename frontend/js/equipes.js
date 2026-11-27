const CHAVE_EQUIPES = "tasky-business-equipes";

const equipesPadrao = [
  { nome: "Produto", membros: ["Ana Souza", "Marina Alves"] },
  { nome: "Comercial", membros: ["Carlos Lima", "Pedro Dias"] },
];

let equipes = JSON.parse(localStorage.getItem(CHAVE_EQUIPES)) || equipesPadrao;

function salvarEquipes() {
  localStorage.setItem(CHAVE_EQUIPES, JSON.stringify(equipes));
}

function renderizarEquipes() {
  const lista = document.getElementById("equipes-lista");
  lista.replaceChildren();

  if (equipes.length === 0) {
    const vazia = document.createElement("p");
    vazia.dataset.i18n = "equipes.vazia";
    vazia.textContent = traduzir("equipes.vazia");
    lista.appendChild(vazia);
    return;
  }

  equipes.forEach((equipe, indice) => {
    const card = document.createElement("article");
    card.className = "card equipe-card";

    const titulo = document.createElement("strong");
    titulo.textContent = equipe.nome;

    const quantidade = document.createElement("small");
    quantidade.textContent = `${equipe.membros.length} ${traduzir("equipes.membrosCount")}`;

    const membros = document.createElement("ul");
    equipe.membros.forEach((membro) => {
      const item = document.createElement("li");
      item.textContent = membro;
      membros.appendChild(item);
    });

    const excluir = document.createElement("button");
    excluir.className = "btn-del";
    excluir.dataset.i = indice;
    excluir.dataset.i18n = "equipes.excluir";
    excluir.textContent = traduzir("equipes.excluir");

    card.append(titulo, quantidade, membros, excluir);
    lista.appendChild(card);
  });

  if (typeof aplicarIdioma === "function") aplicarIdioma(idiomaAtual);
}

document.getElementById("form-equipe").addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nome = document.getElementById("equipe-nome").value.trim();
  const membros = document
    .getElementById("equipe-membros")
    .value.split(",")
    .map((membro) => membro.trim())
    .filter(Boolean);

  if (!nome) return;

  equipes.push({ nome, membros });
  salvarEquipes();
  evento.target.reset();
  renderizarEquipes();
});

document.getElementById("equipes-lista").addEventListener("click", (evento) => {
  if (!evento.target.classList.contains("btn-del")) return;
  equipes.splice(Number(evento.target.dataset.i), 1);
  salvarEquipes();
  renderizarEquipes();
});

renderizarEquipes();
