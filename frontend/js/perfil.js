document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("tasky-business-usuario") || "{}");
  const salvo = JSON.parse(localStorage.getItem("tasky-business-perfil") || "{}");

  const nome = salvo.nome || usuario.email || "";
  const empresa = salvo.empresa || usuario.empresa || "Acme Studio";
  const email = usuario.email || "";

  document.getElementById("perfil-avatar").textContent = nome.slice(0, 2).toUpperCase();
  document.getElementById("perfil-nome-exibicao").textContent = nome;
  document.getElementById("perfil-email").textContent = email;
  document.getElementById("perfil-nome").value = nome;
  document.getElementById("perfil-empresa").value = empresa;

  document.getElementById("form-perfil").addEventListener("submit", (evento) => {
    evento.preventDefault();

    localStorage.setItem(
      "tasky-business-perfil",
      JSON.stringify({
        nome: document.getElementById("perfil-nome").value.trim(),
        empresa: document.getElementById("perfil-empresa").value.trim(),
        email,
      })
    );

    document.getElementById("perfil-mensagem").textContent = traduzir("perfil.salvo");
    document.getElementById("perfil-nome-exibicao").textContent =
      document.getElementById("perfil-nome").value.trim();
    document.getElementById("perfil-avatar").textContent = document
      .getElementById("perfil-nome")
      .value.trim()
      .slice(0, 2)
      .toUpperCase();
  });

  if (new URLSearchParams(location.search).get("editar")) {
    document.getElementById("perfil-nome").focus();
  }
});
