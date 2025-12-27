import { userPool } from "./auth.cognito.js";
import { saveTokens, clearTokens } from "./auth.tokens.js";
import { ROUTES } from "./auth.constants.js";

const Cognito = window.AmazonCognitoIdentity;

export function login(email, password) {
  return new Promise((resolve, reject) => {

    const authDetails = new Cognito.AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = new Cognito.CognitoUser({
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
      onFailure: reject,
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

  if (!user) {
    clearSession();
    return;
  }

  user.getSession((err, session) => {
    if (err || !session?.isValid()) {
      clearSession();
      return;
    }

    user.globalSignOut({
      onSuccess: clearSession,
      onFailure: clearSession
    });
  });
}

function clearSession() {
  const user = userPool.getCurrentUser();
  if (user) user.signOut();

  clearTokens();
  window.location.replace(ROUTES.LOGIN);
}
