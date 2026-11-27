document.addEventListener("DOMContentLoaded", () => {
  const perfil = JSON.parse(localStorage.getItem("tasky-business-perfil") || "{}");
  const form = document.getElementById("form-config");

  document.getElementById("config-empresa").value = perfil.empresa || "Acme Studio";
  document.getElementById("config-idioma").value = idiomaAtual;
  document.getElementById("config-tema").value = document.body.dataset.theme || "light";

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const empresa = document.getElementById("config-empresa").value.trim();
    const idioma = document.getElementById("config-idioma").value;
    const tema = document.getElementById("config-tema").value;

    localStorage.setItem(
      "tasky-business-perfil",
      JSON.stringify({ ...perfil, empresa, email: perfil.email || "" })
    );
    localStorage.setItem("theme", tema);
    aplicarIdioma(idioma);
    document.body.dataset.theme = tema;

    document.getElementById("config-mensagem").textContent = traduzir("config.salvo");
  });
});
