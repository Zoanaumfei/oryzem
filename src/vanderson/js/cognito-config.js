// js/cognito-config.js

const COGNITO_CONFIG = {
  UserPoolId: "us-east-1_tuCP4JyT5",
  ClientId: "37366mm0u7r51henlt049759if",
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(COGNITO_CONFIG);
