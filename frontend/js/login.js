const API_LOGIN = "http://127.0.0.1:3001/api";

const formEmail = document.getElementById("form-email");
const formCodigo = document.getElementById("form-codigo");
const emailInput = document.getElementById("login-email");
const codigoInput = document.getElementById("login-codigo");
const caixaCodigo = document.getElementById("codigo-box");
const mensagem = document.getElementById("mensagem");

formEmail.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensagem.textContent = "";

  try {
    const resposta = await fetch(`${API_LOGIN}/auth/solicitar-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailInput.value.trim() }),
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || "erro");

    codigoInput.value = dados.token;
    caixaCodigo.hidden = false;
    mensagem.textContent = traduzir("login.mensagem");
  } catch {
    mensagem.textContent = traduzir("login.erro");
  }
});

formCodigo.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensagem.textContent = "";

  try {
    const resposta = await fetch(`${API_LOGIN}/auth/verificar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInput.value.trim(),
        token: codigoInput.value.trim(),
      }),
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || "erro");

    localStorage.setItem("tasky-business-token", dados.token);
    localStorage.setItem("tasky-business-usuario", JSON.stringify(dados.usuario));

    const voltar = new URLSearchParams(location.search).get("voltar") || "dashboard.html";
    location.href = voltar;
  } catch {
    mensagem.textContent = traduzir("login.erro");
  }
});
