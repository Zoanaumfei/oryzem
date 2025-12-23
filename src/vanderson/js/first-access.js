console.log("first-access.js carregado");

document.getElementById("firstAccessForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    const stored = sessionStorage.getItem("cognitoNewPasswordUser");

    if (!stored) {
      alert("Sessão expirada. Faça login novamente.");
      window.location.replace("/login-page.html");
      return;
    }

    const { username, attributes, session } = JSON.parse(stored);

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: username,
      Pool: userPool
    });

    cognitoUser.Session = session;

    cognitoUser.completeNewPasswordChallenge(
      newPassword,
      attributes,
      {
        onSuccess: function (result) {
          sessionStorage.removeItem("cognitoNewPasswordUser");

          const idToken = result.getIdToken().getJwtToken();
          const accessToken = result.getAccessToken().getJwtToken();

          localStorage.setItem("idToken", idToken);
          localStorage.setItem("accessToken", accessToken);

          alert("Senha definida com sucesso!");

          window.location.replace("/login-page.html");
        },

        onFailure: function (err) {
          console.error("Erro Cognito:", err);
          alert(err.message || "Erro ao definir nova senha");
        }
      }
    );
  });
