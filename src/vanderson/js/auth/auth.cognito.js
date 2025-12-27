const poolData = {
  UserPoolId: "us-east-1_tuCP4JyT5",
  ClientId: "38o16atrmejvgth708cifvbti"
};

const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
export const userPool = new CognitoUserPool(poolData);