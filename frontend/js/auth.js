const CHAVE_TOKEN = "tasky-business-token";
const CHAVE_USUARIO = "tasky-business-usuario";
const API_AUTH = "http://127.0.0.1:3001/api";

function pegarToken() {
  return localStorage.getItem(CHAVE_TOKEN);
}

function sair() {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_USUARIO);
  location.href = "login.html";
}

async function validarSessao() {
  const token = pegarToken();
  if (!token) return null;

  try {
    const resposta = await fetch(`${API_AUTH}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!resposta.ok) throw new Error("Token invalido");
    return await resposta.json();
  } catch {
    localStorage.removeItem(CHAVE_TOKEN);
    localStorage.removeItem(CHAVE_USUARIO);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const usuario = await validarSessao();

  if (!usuario) {
    const voltar = encodeURIComponent(location.pathname.split("/").pop());
    location.href = `login.html?voltar=${voltar}`;
    return;
  }

  const acoes = document.querySelector(".topbar-acoes");
  if (!acoes) return;

  const btnSair = document.createElement("button");
  btnSair.className = "btn-sair";
  btnSair.dataset.i18n = "perfil.sair";
  btnSair.textContent = "Sair";
  btnSair.addEventListener("click", sair);

  const perfil = document.createElement("div");
  perfil.className = "perfil";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = String(usuario.email || "?").slice(0, 2).toUpperCase();

  const info = document.createElement("div");
  info.className = "perfil-info";

  const nome = document.createElement("strong");
  nome.textContent = usuario.email;

  const detalhe = document.createElement("small");
  detalhe.textContent = `${usuario.empresa} · Business`;

  info.append(nome, detalhe);
  perfil.append(avatar, info);

  acoes.insertBefore(btnSair, acoes.firstChild);
  acoes.insertBefore(perfil, acoes.firstChild);

  if (typeof aplicarIdioma === "function") aplicarIdioma(idiomaAtual);
});
