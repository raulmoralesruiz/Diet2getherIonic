import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LogInService } from './pages/entry/services/log-in.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  online: boolean = false;
  admin: boolean = false;

  constructor(private route: Router, private login: LogInService) {}

  ngOnInit(): void {
    this.online = this.login.isLoggedIn('');
    this.admin = this.login.isAdmin('');

    this.login.changeLoginStatus$.subscribe((loggedStatus: boolean) => {
      this.online = loggedStatus;
    });

    this.login.changeAdminStatus$.subscribe((adminStatus: boolean) => {
      this.admin = adminStatus;
    });

    /* if ((localStorage.getItem("dietUsernameSession") && (localStorage.getItem("dietUsernameSession") != "" && localStorage.getItem("dietUsernameSession") != undefined))) {
      this.online = true;
    } */

    this.login.isUserInSession();
  }

  checkSessionStatus() {
    const username = localStorage.getItem('dietUsernameSession');

    if (this.online == true) {
      // alert("home");
      this.route.navigate(['home']);
    } else {
      // alert("welcome");
      this.route.navigate(['welcome']);
    }
  }

  logout() {
    // borrar localStorage dietUsernameSession
    this.login.logout();

    // redirigir a welcome
  }
}
