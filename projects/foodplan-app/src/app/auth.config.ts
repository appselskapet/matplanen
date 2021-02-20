import { ENV } from './core/env.config';

interface AuthConfig {
  clientID: string;
  domain: string;
  responseType: string,
//  audience: string;
  redirectUri: string;
  scope: string;
};

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'o1G9ETOxDui4rBqbknU9Hdw1FMN3d2wK',
  domain: 'dev-e6rj7ehd.eu.auth0.com', // e.g., you.auth0.com
  responseType: 'token',
//  audience: '[YOUR_AUTH0_API_AUDIENCE]', // e.g., http://localhost:8083/api/
  redirectUri: `${ENV.BASE_URI}/`,
  scope: 'openid profile'
};