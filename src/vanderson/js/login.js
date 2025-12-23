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

      localStorage.setItem("idToken", idToken);
      localStorage.setItem("accessToken", accessToken);

      redirectByGroup(expectedGroup);
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
    getGroupInternal()
  );
});

document.getElementById(ELEMENT_ID.EXTERNAL_SIGN_OUT_BUTTON)?.addEventListener("click", logout);

// Externo
document.getElementById(ELEMENT_ID.EXTERNAL_SIGN_IN_BUTTON)?.addEventListener("click", e => {
  e.preventDefault();
  login(
    document.getElementById(ELEMENT_ID.EXTERNAL_EMAIL).value,
    document.getElementById(ELEMENT_ID.EXTERNAL_PASSWORD).value,
    getGroupExternal()
  );
});

document.getElementById(ELEMENT_ID.EXTERNAL_SIGN_OUT_BUTTON)?.addEventListener("click", logout);
