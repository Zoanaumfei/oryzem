import { login, logout } from "../auth/auth.service.js";
import { resolveUserGroup } from "../auth/auth.groups.js";
import { redirectByGroup } from "../auth/auth.redirect.js";
import { GROUPS } from "../auth/auth.constants.js";

const ELEMENT_ID = {
  INTERNAL_EMAIL: "internEmail",
  INTERNAL_PASSWORD: "internPassword",
  INTERNAL_SIGN_IN_BUTTON: "internSignInButton",
  INTERNAL_SIGN_OUT_BUTTON: "internSignOutButton",
  EXTERNAL_EMAIL: "externEmail",
  EXTERNAL_PASSWORD: "externPassword",
  EXTERNAL_SIGN_IN_BUTTON: "externSignInButton",
  EXTERNAL_SIGN_OUT_BUTTON: "externSignOutButton"
};

// INTERNAL LOGIN
document
  .getElementById(ELEMENT_ID.INTERNAL_SIGN_IN_BUTTON)
  ?.addEventListener("click", async (e) => {
    e.preventDefault();

    await handleLogin(
      document.getElementById(ELEMENT_ID.INTERNAL_EMAIL).value,
      document.getElementById(ELEMENT_ID.INTERNAL_PASSWORD).value,
      GROUPS.INTERNAL
    );
  });

// EXTERNAL LOGIN
document
  .getElementById(ELEMENT_ID.EXTERNAL_SIGN_IN_BUTTON)
  ?.addEventListener("click", async (e) => {
    e.preventDefault();

    await handleLogin(
      document.getElementById(ELEMENT_ID.EXTERNAL_EMAIL).value,
      document.getElementById(ELEMENT_ID.EXTERNAL_PASSWORD).value,
      GROUPS.EXTERNAL
    );
  });

// LOGOUT
document
  .getElementById(ELEMENT_ID.INTERNAL_SIGN_OUT_BUTTON)
  ?.addEventListener("click", logout);

document
  .getElementById(ELEMENT_ID.EXTERNAL_SIGN_OUT_BUTTON)
  ?.addEventListener("click", logout);

// ------------------------

async function handleLogin(email, password, expectedGroup) {
  try {
    await login(email, password);

      if (userGroup != expectedGroup || userGroup != GROUPS.ADMIN) {
      alert("Você não tem permissão para este ambiente.");
      logout();
      return;
    }

    redirectByGroup(userGroup);
  } catch (err) {
    alert(err.message || "Erro ao autenticar");
  }
}
