import { Component } from '@angular/core';
import { AuthService } from "./auth.service";

@Component({
  selector: 'appselskapet-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'foodplan-app';
  constructor(public auth: AuthService) {
    auth.handleAuthentication();
  }
}
