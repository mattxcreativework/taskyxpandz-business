const MODO_DEMO = location.hostname.endsWith("github.io");

const idiomas = {
  pt: {
    "aba.dashboard": "Dashboard | TaskyXPandz for Business",
    "aba.tarefas": "Tarefas | TaskyXPandz for Business",
    "aba.equipes": "Equipes | TaskyXPandz for Business",
    "aba.relatorios": "Relatórios | TaskyXPandz for Business",
    "aba.configuracoes": "Configurações | TaskyXPandz for Business",
    "nav.dashboard": "Dashboard",
    "nav.tarefas": "Tarefas",
    "nav.equipes": "Equipes",
    "nav.relatorios": "Relatórios",
    "nav.configuracoes": "Configurações",
    "acao.tema": "Alternar tema",
    "titulo.dashboard": "Dashboard",
    "titulo.tarefas": "Tarefas",
    "titulo.equipes": "Equipes",
    "titulo.relatorios": "Relatórios",
    "titulo.configuracoes": "Configurações",
    "card.ativas": "Tarefas ativas",
    "card.concluidas": "Concluídas",
    "card.atrasadas": "Atrasadas",
    "card.equipe": "Equipe",
    "lista.recentes": "Tarefas recentes",
    "form.nova": "Nova tarefa",
    "form.responsavel": "Responsável",
    "form.prazo": "Prazo (ex: 30/11)",
    "form.adicionar": "Adicionar",
    "tabela.tarefa": "Tarefa",
    "tabela.responsavel": "Responsável",
    "tabela.prazo": "Prazo",
    "tabela.status": "Status",
    "acao.excluir": "Excluir",
    "acao.status": "Mudar status",
    "badge.andamento": "Em andamento",
    "badge.concluida": "Concluída",
    "badge.atrasada": "Atrasada",
    "texto.equipes": "Em breve: gestão de equipes e membros.",
    "texto.relatorios": "Em breve: gráficos e indicadores do projeto.",
    "texto.configuracoes": "Em breve: preferências da empresa e do usuário.",
    "aba.login": "Entrar | TaskyXPandz for Business",
    "login.titulo": "Entrar",
    "login.descricao": "Sem senha: enviamos um link para o seu e-mail.",
    "login.email": "E-mail da empresa",
    "login.enviar": "Enviar código",
    "login.codigo": "Código recebido",
    "login.entrar": "Entrar",
    "login.mensagem": "Código gerado. Use o código abaixo para entrar.",
    "login.mensagemDemo": "Modo demo (GitHub Pages): use o código DEMO1234 abaixo.",
    "login.mensagemEmail": "Código enviado para o seu e-mail.",
    "login.erro": "Não foi possível entrar. Confira o e-mail e o código.",
    "perfil.sair": "Sair",
    "perfil.ver": "Ver perfil",
    "perfil.editar": "Editar perfil",
    "perfil.idioma": "Idioma",
    "perfil.temaClaro": "Modo claro",
    "perfil.temaEscuro": "Modo escuro",
    "perfil.titulo": "Meu perfil",
    "perfil.descricao": "Seus dados de acesso e preferências.",
    "perfil.nome": "Nome",
    "perfil.empresa": "Empresa",
    "perfil.email": "E-mail",
    "perfil.salvar": "Salvar alterações",
    "perfil.salvo": "Alterações salvas.",
    "equipes.descricao": "Gerencie equipes e membros.",
    "equipes.nome": "Nome da equipe",
    "equipes.membros": "Membros (separados por vírgula)",
    "equipes.adicionar": "Adicionar equipe",
    "equipes.membrosCount": "membros",
    "equipes.excluir": "Excluir",
    "equipes.vazia": "Nenhuma equipe cadastrada.",
    "relatorios.descricao": "Indicadores calculados a partir das tarefas.",
    "relatorios.total": "Total de tarefas",
    "relatorios.taxa": "Taxa de conclusão",
    "relatorios.porResponsavel": "Por responsável",
    "config.descricao": "Preferências da empresa e do usuário.",
    "config.empresa": "Nome da empresa",
    "config.idioma": "Idioma padrão",
    "config.tema": "Tema padrão",
    "config.claro": "Claro",
    "config.escuro": "Escuro",
    "config.salvar": "Salvar preferências",
    "config.salvo": "Preferências salvas.",
  },
  en: {
    "aba.dashboard": "Dashboard | TaskyXPandz for Business",
    "aba.tarefas": "Tasks | TaskyXPandz for Business",
    "aba.equipes": "Teams | TaskyXPandz for Business",
    "aba.relatorios": "Reports | TaskyXPandz for Business",
    "aba.configuracoes": "Settings | TaskyXPandz for Business",
    "nav.dashboard": "Dashboard",
    "nav.tarefas": "Tasks",
    "nav.equipes": "Teams",
    "nav.relatorios": "Reports",
    "nav.configuracoes": "Settings",
    "acao.tema": "Toggle theme",
    "titulo.dashboard": "Dashboard",
    "titulo.tarefas": "Tasks",
    "titulo.equipes": "Teams",
    "titulo.relatorios": "Reports",
    "titulo.configuracoes": "Settings",
    "card.ativas": "Active tasks",
    "card.concluidas": "Completed",
    "card.atrasadas": "Late",
    "card.equipe": "Team",
    "lista.recentes": "Recent tasks",
    "form.nova": "New task",
    "form.responsavel": "Owner",
    "form.prazo": "Due date (ex: 30/11)",
    "form.adicionar": "Add",
    "tabela.tarefa": "Task",
    "tabela.responsavel": "Owner",
    "tabela.prazo": "Due date",
    "tabela.status": "Status",
    "acao.excluir": "Delete",
    "acao.status": "Change status",
    "badge.andamento": "In progress",
    "badge.concluida": "Completed",
    "badge.atrasada": "Late",
    "texto.equipes": "Soon: team and member management.",
    "texto.relatorios": "Soon: charts and project indicators.",
    "texto.configuracoes": "Soon: company and user preferences.",
    "aba.login": "Sign in | TaskyXPandz for Business",
    "login.titulo": "Sign in",
    "login.descricao": "No password: we send a code to your e-mail.",
    "login.email": "Company e-mail",
    "login.enviar": "Send code",
    "login.codigo": "Received code",
    "login.entrar": "Sign in",
    "login.mensagem": "Code generated. Use the code below to sign in.",
    "login.mensagemDemo": "Demo mode (GitHub Pages): use code DEMO1234 below.",
    "login.mensagemEmail": "Code sent to your e-mail.",
    "login.erro": "Could not sign in. Check your e-mail and code.",
    "perfil.sair": "Sign out",
    "perfil.ver": "View profile",
    "perfil.editar": "Edit profile",
    "perfil.idioma": "Language",
    "perfil.temaClaro": "Light mode",
    "perfil.temaEscuro": "Dark mode",
    "perfil.titulo": "My profile",
    "perfil.descricao": "Your access data and preferences.",
    "perfil.nome": "Name",
    "perfil.empresa": "Company",
    "perfil.email": "E-mail",
    "perfil.salvar": "Save changes",
    "perfil.salvo": "Changes saved.",
    "equipes.descricao": "Manage teams and members.",
    "equipes.nome": "Team name",
    "equipes.membros": "Members (comma separated)",
    "equipes.adicionar": "Add team",
    "equipes.membrosCount": "members",
    "equipes.excluir": "Delete",
    "equipes.vazia": "No teams yet.",
    "relatorios.descricao": "Indicators calculated from tasks.",
    "relatorios.total": "Total tasks",
    "relatorios.taxa": "Completion rate",
    "relatorios.porResponsavel": "By owner",
    "config.descricao": "Company and user preferences.",
    "config.empresa": "Company name",
    "config.idioma": "Default language",
    "config.tema": "Default theme",
    "config.claro": "Light",
    "config.escuro": "Dark",
    "config.salvar": "Save preferences",
    "config.salvo": "Preferences saved.",
  },
};

let idiomaAtual = localStorage.getItem("tasky-business-idioma") || "pt";

function traduzir(chave) {
  return idiomas[idiomaAtual][chave] || chave;
}

function aplicarIdioma(idioma) {
  idiomaAtual = idioma;
  localStorage.setItem("tasky-business-idioma", idioma);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = traduzir(el.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = traduzir(el.dataset.i18nPlaceholder);
  });

  document.querySelectorAll(".btn-idioma").forEach((btn) => {
    btn.classList.toggle("ativo-idioma", btn.dataset.idioma === idioma);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const topbar = document.querySelector(".topbar");
  if (topbar) {
    const acoes = document.createElement("div");
    acoes.className = "topbar-acoes";

    ["pt", "en"].forEach((sigla) => {
      const btn = document.createElement("button");
      btn.className = "btn-idioma";
      btn.dataset.idioma = sigla;
      btn.textContent = sigla.toUpperCase();
      acoes.appendChild(btn);
    });

    const tema = document.getElementById("theme-toggle");
    if (tema) {
      topbar.insertBefore(acoes, tema);
      acoes.appendChild(tema);
    } else {
      topbar.appendChild(acoes);
    }
  }

  document.querySelectorAll(".btn-idioma").forEach((btn) => {
    btn.addEventListener("click", () => aplicarIdioma(btn.dataset.idioma));
  });

  aplicarIdioma(idiomaAtual);
});