const paginas = [
  { arquivo: "dashboard.html", nome: "Dashboard" },
  { arquivo: "tarefas.html", nome: "Tarefas" },
  { arquivo: "equipes.html", nome: "Equipes" },
  { arquivo: "relatorios.html", nome: "Relatórios" },
  { arquivo: "configuracoes.html", nome: "Configurações" },
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
  link.textContent = p.nome;
  if (p.arquivo === atual) link.className = "ativo";
  nav.appendChild(link);
});

aside.append(brand, nav);