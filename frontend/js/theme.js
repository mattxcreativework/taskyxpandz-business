const botao = document.getElementById("theme-toggle");

const salvo = localStorage.getItem("theme");
if (salvo) document.body.dataset.theme = salvo;

if (botao) {
  botao.addEventListener("click", () => {
    const novo = document.body.dataset.theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = novo;
    localStorage.setItem("theme", novo);
  });
}