import { logout, login, GROUPS} from "./auth.js";

const ELEMENT_ID = {
  INTERNAL_EMAIL: "internEmail",
  INTERNAL_PASSWORD: "internPassword",
  INTERNAL_SIGN_IN_BUTTON: "internSignInButton",
  INTERNAL_SIGN_OUT_BUTTON: "internSignOutButton",
  EXTERNAL_EMAIL: "externEmail",
  EXTERNAL_PASSWORD: "externPassword",
  EXTERNAL_SIGN_IN_BUTTON: "externSignInButton",
  EXTERNAL_SIGN_OUT_BUTTON: "externSignOutButton"
}

// EVENT LISTENERS
document.getElementById(ELEMENT_ID.INTERNAL_SIGN_IN_BUTTON)?.addEventListener("click", e => {
  e.preventDefault();
  login(
    document.getElementById(ELEMENT_ID.INTERNAL_EMAIL).value,
    document.getElementById(ELEMENT_ID.INTERNAL_PASSWORD).value,
    GROUPS.INTERNAL
  );
});

document.getElementById(ELEMENT_ID.INTERNAL_SIGN_OUT_BUTTON)?.addEventListener("click", e => {
  e.preventDefault();
  logout();
});

// Externo
document.getElementById(ELEMENT_ID.EXTERNAL_SIGN_IN_BUTTON)?.addEventListener("click", e => {
  e.preventDefault();
  login(
    document.getElementById(ELEMENT_ID.EXTERNAL_EMAIL).value,
    document.getElementById(ELEMENT_ID.EXTERNAL_PASSWORD).value,
    GROUPS.EXTERNAL
  );
});

document.getElementById(ELEMENT_ID.EXTERNAL_SIGN_OUT_BUTTON)?.addEventListener("click", e => {
  e.preventDefault();
  logout();
});

