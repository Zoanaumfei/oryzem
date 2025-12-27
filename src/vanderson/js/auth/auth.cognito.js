// src/auth/auth.cognito.js
import { CognitoUserPool } from "./amazon-cognito-identity.min.js";

const poolData = {
  UserPoolId: "us-east-1_tuCP4JyT5",
  ClientId: "38o16atrmejvgth708cifvbti",
};

export const userPool = new CognitoUserPool(poolData);
