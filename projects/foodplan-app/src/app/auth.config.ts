import { environment } from "../environments/environment";

interface AuthConfig {
  clientID: string;
  domain: string;
  responseType: string,
  redirectUri: string;
  scope: string;
};

export const AUTH_CONFIG: AuthConfig = {
  clientID: environment.auth.clientID,
  domain: environment.auth.domain,
  responseType: 'token',
  redirectUri: environment.auth.redirectUri,
  scope: 'openid profile email'
};