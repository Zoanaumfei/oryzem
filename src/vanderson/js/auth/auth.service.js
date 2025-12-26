import { saveTokens, clearTokens } from "./auth.tokens.js";
import { ROUTES } from "./auth.constants.js";

export function login(email, password) {
  return new Promise((resolve, reject) => {
    const authDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: result => {
        saveTokens({
          idToken: result.getIdToken().getJwtToken(),
          accessToken: result.getAccessToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken(),
        });
        resolve(result);
      },
      onFailure: err => reject(err),
      newPasswordRequired: (attrs) => {
        sessionStorage.setItem("FIRST_ACCESS", JSON.stringify({
          username: cognitoUser.getUsername(),
          attributes: attrs,
          session: cognitoUser.Session,
        }));
        window.location.replace("/first-access.html");
      }
    });
  });
}

export function logout() {
  const user = userPool.getCurrentUser();
  if (user) {
    user.globalSignOut({
      onSuccess: clearSession(),
      onFailure: clearSession(),
    });
    alert:"Logout process if."
  } else {
    clearSession();
    alert: "Logout process else."
  }
}

function clearSession() {
  clearTokens();
  window.location.replace(ROUTES.LOGIN);
}
