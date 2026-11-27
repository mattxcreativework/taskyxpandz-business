const CHAVE_TOKEN = "tasky-business-token";
const CHAVE_USUARIO = "tasky-business-usuario";
const CHAVE_PERFIL = "tasky-business-perfil";
const API_AUTH = "http://127.0.0.1:3001/api";

function pegarToken() {
  return localStorage.getItem(CHAVE_TOKEN);
}

function pegarPerfil() {
  const usuario = JSON.parse(localStorage.getItem(CHAVE_USUARIO) || "{}");
  const salvo = JSON.parse(localStorage.getItem(CHAVE_PERFIL) || "{}");
  return {
    email: salvo.email || usuario.email || "",
    nome: salvo.nome || usuario.email || "",
    empresa: salvo.empresa || usuario.empresa || "Acme Studio",
  };
}

function iniciais(texto) {
  return String(texto || "?").slice(0, 2).toUpperCase();
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

  Array.from(acoes.children).forEach((filho) => {
    filho.hidden = true;
  });

  const dados = pegarPerfil();

  const menu = document.createElement("div");
  menu.className = "perfil-dropdown";
  menu.hidden = true;

  const ver = document.createElement("button");
  ver.className = "perfil-item";
  ver.dataset.acao = "ver";

  const editar = document.createElement("button");
  editar.className = "perfil-item";
  editar.dataset.acao = "editar";

  const linhaIdioma = document.createElement("div");
  linhaIdioma.className = "perfil-linha";

  const rotuloIdioma = document.createElement("span");
  rotuloIdioma.className = "perfil-rotulo";

  const btnTema = document.createElement("button");
  btnTema.className = "perfil-item";
  btnTema.dataset.acao = "tema";

  const btnSair = document.createElement("button");
  btnSair.className = "perfil-item perfil-sair";
  btnSair.dataset.acao = "sair";
  btnSair.addEventListener("click", sair);

  const botoesIdioma = {};
  ["pt", "en"].forEach((sigla) => {
    const btn = document.createElement("button");
    btn.className = "btn-idioma";
    btn.dataset.idioma = sigla;
    btn.textContent = sigla.toUpperCase();
    btn.addEventListener("click", () => {
      aplicarIdioma(sigla);
      atualizar();
    });
    botoesIdioma[sigla] = btn;
    linhaIdioma.append(rotuloIdioma, btn);
  });

  function alternarTema() {
    const novo = document.body.dataset.theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = novo;
    localStorage.setItem("theme", novo);
    atualizar();
  }

  function atualizar() {
    ver.textContent = traduzir("perfil.ver");
    editar.textContent = traduzir("perfil.editar");
    rotuloIdioma.textContent = traduzir("perfil.idioma");
    btnTema.textContent = traduzir(
      document.body.dataset.theme === "dark" ? "perfil.temaClaro" : "perfil.temaEscuro"
    );
    btnSair.textContent = traduzir("perfil.sair");

    Object.entries(botoesIdioma).forEach(([sigla, btn]) => {
      btn.classList.toggle("ativo-idioma", sigla === idiomaAtual);
    });
  }

  ver.addEventListener("click", () => {
    location.href = "perfil.html";
  });
  editar.addEventListener("click", () => {
    location.href = "perfil.html?editar=1";
  });
  btnTema.addEventListener("click", alternarTema);

  menu.append(ver, editar, linhaIdioma, btnTema, btnSair);
  atualizar();

  const botao = document.createElement("button");
  botao.className = "avatar-btn";
  botao.textContent = iniciais(dados.nome);
  botao.setAttribute("aria-label", "Perfil");
  botao.addEventListener("click", (evento) => {
    evento.stopPropagation();
    menu.hidden = !menu.hidden;
  });

  const perfil = document.createElement("div");
  perfil.className = "perfil-menu";
  perfil.append(botao, menu);

  document.addEventListener("click", (evento) => {
    if (!perfil.contains(evento.target)) menu.hidden = true;
  });

  acoes.appendChild(perfil);
});
