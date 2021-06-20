import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LogInService } from './pages/entry/services/log-in.service';

import { Plugins, PluginRegistry, Capacitor } from '@capacitor/core';
const { SplashScreen, StatusBar }: PluginRegistry = Plugins;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  online: boolean = false;
  admin: boolean = false;

  darkMode: boolean = true;

  constructor(private route: Router, private login: LogInService) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.darkMode = prefersDark.matches;
  }

  ngOnInit(): void {
    this.initializeApp();

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

  initializeApp() {
    SplashScreen.hide();

    if (Capacitor.isPluginAvailable('StatusBar')) {
      StatusBar.setBackgroundColor({ color: '#6aab98' });
    }

    this.changeDarkMode();
  }

  changeDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
      document.body.classList.toggle('dark');
    }
  }

  // setDarkMode() {
  //   console.log(this.darkMode);
  //   this.darkMode = !this.darkMode;
  //   document.body.classList.toggle('dark');
  //   console.log(this.darkMode);
  // }

  setDarkMode(event) {
    if (event.detail.checked) {
      document.body.setAttribute('color-theme', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
    }
  }
  
}
