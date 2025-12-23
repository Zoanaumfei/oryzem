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

function logout() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.replace("/login-page.html");
}
