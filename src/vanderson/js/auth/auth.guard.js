import { isAuthenticated } from "./auth.tokens.js";
import { hasGroup } from "./auth.groups.js";
import { logout } from "./auth.service.js";

export function requireGroup(...allowedGroups) {
  if (!isAuthenticated()) {
    logout();
    return false;
  }

  if (!hasGroup(...allowedGroups)) {
    logout();
    return false;
  }

  return true;
}
