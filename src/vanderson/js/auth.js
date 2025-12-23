/*
Responsável por:
Ler JWT
Saber quem está logado
Validar grupos
Proteger páginas
Logout centralizado
*/

const GROUPS = {
  ADMIN: "Admin-User",
  INTERNAL: "Internal-User",
  EXTERNAL: "External-User"
};

function getGroupAdmin() {
  return GROUPS.ADMIN;
}

function getGroupInternal() {
  return GROUPS.INTERNAL;
} 

function getGroupExternal() {
  return GROUPS.EXTERNAL;
}

function getIdToken() {
  return localStorage.getItem("idToken");
}

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

function isAuthenticated() {
  return !!getIdToken();
}

function getUserGroups() {
  const token = getIdToken();
  if (!token) return [];

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload["cognito:groups"] || [];
  } catch (e) {
    return [];
  }
}

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.replace("/login-page.html");
  }
}

function requireGroup(expectedGroup) {
  requireAuth();

  const groups = getUserGroups();

  if (
    !groups.includes(expectedGroup) &&
    !groups.includes(GROUPS.ADMIN)
  ) {
    alert("Você não tem permissão para acessar esta página.");
    logout();
  }
}

function redirectByGroup(expectedGroup) {
  const groups = getUserGroups();

  // Segurança extra (caso alguém chame direto)
  if (!groups.includes(expectedGroup) && !groups.includes(GROUPS.ADMIN)) {
    alert("Você não tem permissão para acessar este ambiente.");
    logout();
    return;
  }

  switch (expectedGroup) {
    case GROUPS.ADMIN:
      // window.location.replace("/admin/dashboard.html");
      alert("REDIRECIONADO PARA A PAGINA DE ADMIN.");
      break;

    case GROUPS.INTERNAL:
      // window.location.replace("/internal/dashboard.html");
      alert("REDIRECIONADO PARA A PAGINA DE INTERNAL.");
      break;

    case GROUPS.EXTERNAL:
      // window.location.replace("/external/home.html");
      alert("REDIRECIONADO PARA A PAGINA DE EXTERNAL.");
      break;

    default:
      alert("Grupo inválido.");
      logout();
  }
}

function bootstrapAuth() {
  // Não logado → login
  function isAuthenticated() {
  const token = getIdToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);

    return payload.exp && payload.exp > now;
  } catch {
    return false;
  }
} 


  const groups = getUserGroups();

  // Prioridade de acesso
  if (groups.includes(GROUPS.ADMIN)) {
    // window.location.replace("/admin/dashboard.html");
    alert("BOOTSTRAP → ADMIN");
    return;
  }

  if (groups.includes(GROUPS.INTERNAL)) {
    // window.location.replace("/internal/dashboard.html");
    alert("BOOTSTRAP → INTERNAL");
    return;
  }

  if (groups.includes(GROUPS.EXTERNAL)) {
    // window.location.replace("/external/home.html");
    alert("BOOTSTRAP → EXTERNAL");
    return;
  }

  // Caso extremo (token inválido ou sem grupos)
  logout();
}

function logout() {
  const user = userPool.getCurrentUser();

  if (user) {
    user.globalSignOut({
      onSuccess: function () {
        clearLocalSession();
      },
      onFailure: function (err) {
        console.error("Erro no globalSignOut:", err);
        clearLocalSession();
      }
    });
  } else {
    clearLocalSession();
  }
}

function clearLocalSession() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.replace("/login-page.html");
}

