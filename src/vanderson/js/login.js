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

function login(email, password, expectedGroup) {
  const authDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: email,
    Password: password,
  });

  const userData = {
    Username: email,
    Pool: userPool,
  };  

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authDetails, {
    onSuccess: function (result) {
      const idToken = result.getIdToken().getJwtToken();
      const accessToken = result.getAccessToken().getJwtToken();

      // Salva tokens (auth.js irá usar)
      localStorage.setItem("idToken", idToken);
      localStorage.setItem("accessToken", accessToken);

      const groups = getUserGroups();

      // 🔒 Validação do tipo de login
      if (!groups.includes(expectedGroup) && !groups.includes(GROUPS.ADMIN))
     {
        alert("Você não tem permissão para acessar este ambiente.");
        cognitoUser.signOut();
        return;
      }     

      // Redirecionamento
      if (groups.includes(GROUPS.ADMIN)) {
        // window.location.href = "/admin/dashboard.html";
        alert("REDICIONADO PARA A PAGINA DE ADMIN.");
      } else if (groups.includes(GROUPS.INTERNAL)) {
        // window.location.href = "/internal/dashboard.html";
        alert("REDICIONADO PARA A PAGINA DE INTERNAL.");
      } else if (groups.includes(GROUPS.EXTERNAL)) {
        // window.location.href = "/external/home.html";
        alert("REDICIONADO PARA A PAGINA DE EXTERNAL.");
      }
    },

    onFailure: function (err) {
      alert(err.message || "Erro ao autenticar");
    },

    newPasswordRequired: function (userAttributes, requiredAttributes) {
    delete userAttributes.email;
    delete userAttributes.email_verified;

    delete userAttributes.phone_number_verified;
    delete userAttributes.sub;

  sessionStorage.setItem(
    "cognitoNewPasswordUser",
    JSON.stringify({
      username: cognitoUser.getUsername(),
      attributes: userAttributes,
      session: cognitoUser.Session,
    })
  );

  window.location.href = "../html/first-access.html";
}

  });
}

/* ====== BINDS ====== */

// Interno
document.getElementById(ELEMENT_ID.INTERNAL_SIGN_IN_BUTTON)?.addEventListener("click", e => {
  e.preventDefault();
  login(
    document.getElementById(ELEMENT_ID.INTERNAL_EMAIL).value,
    document.getElementById(ELEMENT_ID.INTERNAL_PASSWORD).value,
    GROUPS.INTERNAL
  );
});

document.getElementById(ELEMENT_ID.EXTERNAL_SIGN_OUT_BUTTON)?.addEventListener("click", logout);

// Externo
document.getElementById(ELEMENT_ID.EXTERNAL_SIGN_IN_BUTTON)?.addEventListener("click", e => {
  e.preventDefault();
  login(
    document.getElementById(ELEMENT_ID.EXTERNAL_EMAIL).value,
    document.getElementById(ELEMENT_ID.EXTERNAL_PASSWORD).value,
    GROUPS.EXTERNAL
  );
});

document.getElementById(ELEMENT_ID.EXTERNAL_SIGN_OUT_BUTTON)?.addEventListener("click", logout);
