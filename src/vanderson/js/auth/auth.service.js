// src/auth/auth.service.js
import {
  AuthenticationDetails,
  CognitoUser
} from "C:\Users\vande\Oryzem\oryzem\oryzem-frontend\node_modules\amazon-cognito-identity-js\dist\amazon-cognito-identity.min.js";

import { userPool } from "./auth.cognito";
import { saveTokens, clearTokens } from "./auth.tokens";
import { ROUTES } from "./auth.constants";

export function login(email, password) {
  return new Promise((resolve, reject) => {
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    user.authenticateUser(authDetails, {
      onSuccess: result => {
        saveTokens({
          idToken: result.getIdToken().getJwtToken(),
          accessToken: result.getAccessToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken(),
        });
        resolve(result);
      },
      onFailure: reject,
      newPasswordRequired: attrs => {
        sessionStorage.setItem("FIRST_ACCESS", JSON.stringify({
          username: user.getUsername(),
          attributes: attrs,
          session: user.Session,
        }));
        window.location.replace("/first-access.html");
      }
    });
  });
}

export function logout() {
  const user = userPool.getCurrentUser();

  if (!user) {
    clearSession();
    return;
  }

  user.signOut();
  clearSession();
}

function clearSession() {
  clearTokens();
  window.location.replace(ROUTES.LOGIN);
}
