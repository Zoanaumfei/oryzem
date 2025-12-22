// js/auth.js

function getPayload() {
  const token = localStorage.getItem("idToken");
  if (!token) return null;
  return JSON.parse(atob(token.split(".")[1]));
}

function requireAuth(requiredGroup) {
  const payload = getPayload();

  if (!payload) {
    window.location.href = "/login.html";
    return;
  }

  const groups = payload["cognito:groups"] || [];

  if (
    requiredGroup &&
    !groups.includes(requiredGroup) &&
    !groups.includes("ADMIN")
  ) {
    alert("Acesso negado.");
    window.location.href = "/login.html";
  }
}
