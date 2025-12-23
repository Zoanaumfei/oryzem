/*
Responsável por:
- Ler JWT
- Saber quem está logado
- Validar grupos
- Proteger páginas
- Logout centralizado
- Bootstrap após refresh
*/

export const GROUPS = {
  ADMIN: "Admin-User",
  INTERNAL: "Internal-User",
  EXTERNAL: "External-User"
};

/* =========================
   TOKENS
========================= */

function getIdToken() {
  return localStorage.getItem("idToken");
}

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

/* =========================
   AUTH
========================= */

export function isAuthenticated() {
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

function getUserGroups() {
  const token = getIdToken();
  if (!token) return [];

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload["cognito:groups"] || [];
  } catch {
    return [];
  }
}

/* =========================
   GUARDS
========================= */

function requireAuth() {
  if (!isAuthenticated()) {
    logout();
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

/* =========================
   REDIRECT (LOGIN FLOW)
========================= */

export function redirectByGroup(expectedGroup) {
  if (!isAuthenticated()) {
    logout();
    return;
  }

  const groups = getUserGroups();

  if (!groups.includes(expectedGroup) && !groups.includes(GROUPS.ADMIN)) {
    alert("Você não tem permissão para acessar este ambiente.");
    logout();
    return;
  }

  switch (expectedGroup) {
    case GROUPS.ADMIN:
      // window.location.replace("/admin/dashboard.html");
      alert("REDIRECIONADO PARA ADMIN");
      break;

    case GROUPS.INTERNAL:
      // window.location.replace("/internal/dashboard.html");
      alert("REDIRECIONADO PARA INTERNAL");
      break;

    case GROUPS.EXTERNAL:
      // window.location.replace("/external/home.html");
      alert("REDIRECIONADO PARA EXTERNAL");
      break;

    default:
      logout();
  }
}

/* =========================
   LOGOUT
========================= */

export function logout() {
  // Finaliza sessão no Cognito (se existir)
  const user = userPool.getCurrentUser();
  if (user) {
    user.globalSignOut({
      onSuccess: clearLocalSession,
      onFailure: clearLocalSession
    });
  }

  // Apaga tokens locais (OBRIGATÓRIO)
  clearLocalSession();
}

function clearLocalSession() {
  localStorage.removeItem("idToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  sessionStorage.clear();
  window.location.replace("/login-page.html");
}
