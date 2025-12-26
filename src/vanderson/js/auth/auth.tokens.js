const STORAGE = sessionStorage;

export function saveTokens({ idToken, accessToken, refreshToken }) {
  STORAGE.setItem("idToken", idToken);
  STORAGE.setItem("accessToken", accessToken);
  STORAGE.setItem("refreshToken", refreshToken);
}

export function getIdToken() {
  return STORAGE.getItem("idToken");
}

export function clearTokens() {
  STORAGE.clear();
}

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
