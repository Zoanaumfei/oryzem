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
    user.getSession((err, session) => {
      if (err || !session.isValid()) {
        // Sessão inválida, apenas limpe localmente
        clearSession();
        alert("Sessão expirada. Você foi desconectado.");
        return;
      }
      
      // Sessão válida, faça logout global
      user.globalSignOut({
        onSuccess: () => {
          clearSession();
          alert("Logout realizado com sucesso em todos os dispositivos.");
        },
        onFailure: (err) => {
          console.error("Erro no logout global:", err);
          // Mesmo em caso de erro, limpe os tokens localmente
          clearSession();
          alert("Logout realizado (apenas neste dispositivo).");
        }
      });
    });
  } else {
    // Não há usuário ativo, apenas limpe
    clearSession();
    alert("Você já está desconectado.");
  }
}

function clearSession() {
  // Limpa o usuário atual do UserPool
  const user = userPool.getCurrentUser();
  if (user) {
    user.signOut();
  }
  
  // Limpa os tokens do armazenamento
  clearTokens();
  
  // Redireciona para login
  window.location.replace(ROUTES.LOGIN);
}
