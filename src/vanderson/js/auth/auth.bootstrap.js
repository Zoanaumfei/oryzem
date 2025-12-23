import { isAuthenticated } from "./auth.tokens.js";
import { resolveUserGroup } from "./auth.groups.js";
import { GROUPS } from "./auth.constants.js";
import { logout } from "./auth.service.js";

export function bootstrapAuth() {
  // Não autenticado ou token inválido
  if (!isAuthenticated()) {
    logout();
    return;
  }

  const group = resolveUserGroup();

  switch (group) {
    case GROUPS.ADMIN:
      // window.location.replace("/admin/dashboard.html");
      console.log("BOOTSTRAP → ADMIN");
      break;

    case GROUPS.INTERNAL:
      // window.location.replace("/internal/dashboard.html");
      console.log("BOOTSTRAP → INTERNAL");
      break;

    case GROUPS.EXTERNAL:
      // window.location.replace("/external/home.html");
      console.log("BOOTSTRAP → EXTERNAL");
      break;

    default:
      // Token válido mas sem grupo
      logout();
  }
}
