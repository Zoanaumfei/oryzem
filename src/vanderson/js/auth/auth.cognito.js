// src/auth/auth.cognito.js
import { CognitoUserPool } from "C:\Users\vande\Oryzem\oryzem\oryzem-frontend\node_modules\amazon-cognito-identity-js\dist\amazon-cognito-identity.js"

const poolData = {
  UserPoolId: "us-east-1_tuCP4JyT5",
  ClientId: "38o16atrmejvgth708cifvbti",
};

export const userPool = new CognitoUserPool(poolData);

