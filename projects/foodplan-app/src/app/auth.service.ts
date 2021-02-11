import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as auth0 from 'auth0-js';

// why do you need defining window as any?
// check this: https://github.com/aws/aws-amplify/issues/678#issuecomment-389106098
(window as any).global = window;

@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth({
    clientID: 'o1G9ETOxDui4rBqbknU9Hdw1FMN3d2wK',
    domain: 'dev-e6rj7ehd.eu.auth0.com',
    responseType: 'token',
//    redirectUri: 'http://localhost:4200/',
    redirectUri: 'https://appselskapet.no/matplanen/',
    scope: 'openid'
  });

  accessToken: String | undefined;
  expiresAt: Number | undefined;

  constructor(public router: Router) {}

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        window.location.hash = '';
        this.accessToken = authResult.accessToken;
        this.expiresAt = (authResult.expiresIn! * 1000) + new Date().getTime();
        this.router.navigate(['/dashboard']);
      } else if (err) {
        this.router.navigate(['/']);
        console.log(err);
      }
    });
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    this.accessToken = "";
    this.expiresAt = -1;
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    return new Date().getTime() < this.expiresAt!;
  }
}