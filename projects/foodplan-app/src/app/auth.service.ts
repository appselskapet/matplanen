import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as auth0 from 'auth0-js';
import { BehaviorSubject } from "rxjs";
import { AUTH_CONFIG } from "./auth.config";

// why do you need defining window as any?
// check this: https://github.com/aws/aws-amplify/issues/678#issuecomment-389106098
(window as any).global = window;

@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth(AUTH_CONFIG);

  accessToken: String | undefined;
  expiresAt: Number | undefined;
  userProfile!: auth0.Auth0UserProfile;
  userProfile$ = new BehaviorSubject<any>(this.userProfile);
  loggedIn: boolean = false;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
  
  constructor(public router: Router) {}

  setLoggedIn(value: boolean) {
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        window.location.hash = '';
        this.accessToken = authResult.accessToken;
        this.expiresAt = (authResult.expiresIn! * 1000) + new Date().getTime();
        this.getProfile(authResult);
      } else if (err) {
        console.log(err);
      }
      this.router.navigate(['/']);
    });
  }

  private getProfile(authResult: any) {
    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
        this.setLoggedIn(true);
      } else if (err) {
        console.log(err);
      }
    });
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    this.accessToken = "";
    this.expiresAt = -1;
    this.setLoggedIn(false);
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    return new Date().getTime() < this.expiresAt!;
  }
}