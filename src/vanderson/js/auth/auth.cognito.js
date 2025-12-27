const poolData = {
  UserPoolId: "us-east-1_tuCP4JyT5",
  ClientId: "38o16atrmejvgth708cifvbti"
};

export const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const cognitoUser = new AmazonCognitoIdentity.CognitoUser
