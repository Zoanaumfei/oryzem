import { isAuthenticated } from "./auth.tokens.js";
import { hasGroup } from "./auth.groups.js";
import { logout } from "./auth.service.js";

export function requireGroup(...allowedGroups) {
  if (!isAuthenticated()) {
    alert("Access denied.");
    logout();
    return false;
  }

  if (!hasGroup(...allowedGroups)) {
    alert("Access denied.");
    logout();
    return false;
  }

  return true;
  alert("Access granted.");
}
