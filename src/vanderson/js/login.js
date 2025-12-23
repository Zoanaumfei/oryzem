// js/login.js

function login(email, password, expectedGroup) {
  const authDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: email,
    Password: password,
  });

  const userData = {
    Username: email,
    Pool: userPool,
  };

  const GROUPS = {
  ADMIN: "ADMIN",
  INTERNAL: "INTERNAL",
  EXTERNAL: "EXTERNAL"
};

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authDetails, {
    onSuccess: function (result) {
      const idToken = result.getIdToken().getJwtToken();
      const accessToken = result.getAccessToken().getJwtToken();

      const payload = JSON.parse(atob(idToken.split(".")[1]));
      const groups = payload["cognito:groups"] || [];

      // 🔒 Validação do tipo de login
      if (
        !expectedGroup ||
        (!groups.includes(expectedGroup) && !groups.includes(GROUPS.ADMIN))
       ) {
        alert("Você não tem permissão para acessar este ambiente.");
        cognitoUser.signOut();
        return;
      }

      localStorage.setItem("idToken", idToken);
      localStorage.setItem("accessToken", accessToken);

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

function logout() {
  const user = userPool.getCurrentUser();
  if (user) user.signOut();

  localStorage.clear();
  window.location.href = "/login.html";
}


/* ====== BINDS ====== */

// Interno
document.getElementById("internSignInButton")?.addEventListener("click", e => {
  e.preventDefault();
  login(
    document.getElementById("internEmail").value,
    document.getElementById("internPassword").value,
    GROUPS.INTERNAL
  );
});

document.getElementById("internSignOutButton")?.addEventListener("click", logout);

// Externo
document.getElementById("externSignInButton")?.addEventListener("click", e => {
  e.preventDefault();
  login(
    document.getElementById("externEmail").value,
    document.getElementById("externPassword").value,
    GROUPS.EXTERNAL
  );
});

document.getElementById("externSignOutButton")?.addEventListener("click", logout);
