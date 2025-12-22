// js/first-access.js

document
  .getElementById("firstAccessForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    const storedData = sessionStorage.getItem("cognitoNewPasswordUser");

    if (!storedData) {
      alert("Sessão expirada. Faça login novamente.");
      window.location.replace("/login.html");
      return;
    }

    const { username, attributes } = JSON.parse(storedData);

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.completeNewPasswordChallenge(
      newPassword,
      attributes,
      {
        onSuccess: function (result) {
          const idToken = result.getIdToken().getJwtToken();
          const accessToken = result.getAccessToken().getJwtToken();

          const payload = JSON.parse(atob(idToken.split(".")[1]));
          const groups = payload["cognito:groups"] || [];

          localStorage.setItem("idToken", idToken);
          localStorage.setItem("accessToken", accessToken);

          sessionStorage.removeItem("cognitoNewPasswordUser");

          if (groups.includes("ADMIN")) {
           // window.location.href = "/admin/dashboard.html";
           alert("REDICIONADO PARA A PAGINA DE ADMIN.");
          } else if (groups.includes("INTERNAL")) {
           // window.location.href = "/internal/dashboard.html";
           alert("REDICIONADO PARA A PAGINA DE INTERNAL.");
          } else {
           // window.location.href = "/external/home.html";
           alert("REDICIONADO PARA A PAGINA DE EXTERNAL.");
          }
        },

        onFailure: function (err) {
          alert(err.message || "Erro ao definir nova senha.");
        },
      }
    );
  });
