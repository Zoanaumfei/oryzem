import { isTokenValid } from "./auth.tokens.js";
import { resolveUserGroup } from "./auth.groups.js";
import { redirectByGroup } from "./auth.redirect.js";
import { logout } from "./auth.service.js";

export function bootstrapAuth() {
  if (!isTokenValid()) {
    logout();
    return;
  }

  const group = resolveUserGroup();
  if (!group) {
    logout();
    return;
  }

  redirectByGroup(group);
}
