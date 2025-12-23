import { isAuthenticated, getUserGroups, logout, GROUPS } from "./auth.js";

function bootstrapAuth() {
  if (!isAuthenticated()) {
    logout();
    return;
  }

  const groups = getUserGroups();

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

  logout();
}