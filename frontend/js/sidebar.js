const paginas = [
  { arquivo: "dashboard.html", chave: "nav.dashboard" },
  { arquivo: "tarefas.html", chave: "nav.tarefas" },
  { arquivo: "equipes.html", chave: "nav.equipes" },
  { arquivo: "relatorios.html", chave: "nav.relatorios" },
  { arquivo: "configuracoes.html", chave: "nav.configuracoes" },
];

const atual = location.pathname.split("/").pop();

const aside = document.querySelector(".sidebar");
aside.replaceChildren();

const brand = document.createElement("div");
brand.className = "brand";
brand.textContent = "TaskyXPandz";

const nav = document.createElement("nav");

paginas.forEach((p) => {
  const link = document.createElement("a");
  link.href = p.arquivo;
  link.dataset.i18n = p.chave;
  if (p.arquivo === atual) link.className = "ativo";
  nav.appendChild(link);
});

aside.append(brand, nav);