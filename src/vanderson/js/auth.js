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

let IS_LOGGING_OUT = false;

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

function bootstrapAuth() {
  // Evita execução durante logout
  if (IS_LOGGING_OUT) return;

  // Não autenticado ou token expirado
  if (!isAuthenticated()) {
    logout();
    return;
  }

  const groups = getUserGroups();

  // Prioridade REAL de acesso
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

  // Token válido, mas sem grupo → sessão inválida
  logout();
}

function logout() {
  IS_LOGGING_OUT = true;

  const user = userPool.getCurrentUser();

  if (user) {
    user.globalSignOut({
      onSuccess: clearLocalSession,
      onFailure: clearLocalSession
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
