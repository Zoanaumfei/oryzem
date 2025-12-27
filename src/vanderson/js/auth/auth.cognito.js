const poolData = {
  UserPoolId: "us-east-1_tuCP4JyT5",
  ClientId: "38o16atrmejvgth708cifvbti"
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
