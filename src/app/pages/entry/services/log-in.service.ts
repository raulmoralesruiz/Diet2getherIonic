import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';

import { environment, urlServer } from 'src/environments/environment';
import { urlServerProd } from 'src/environments/environment.prod';

import { UserSignUpDto } from '../models/signup-user-dto';
import { GroupService } from '../../group/services/group.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LogInService {
  readonly ISLOGGEDKEY = 'islogged';
  readonly ISADMINKEY = 'isadmin';
  public urlUsuarioIntentaAcceder = '';

  public adminIntentaAcceder = '';

  public changeLoginStatusSubject = new Subject<boolean>();
  public changeLoginStatus$ = this.changeLoginStatusSubject.asObservable();

  public changeAdminStatusSubject = new Subject<boolean>();
  public changeAdminStatus$ = this.changeAdminStatusSubject.asObservable();

  endPointServer = '';

  atletaRegister: any;

  constructor(
    private http: HttpClient,
    private route: Router,
    private groupService: GroupService,
    public toastController: ToastController
  ) 
  {
    if (!environment.production) {
      this.endPointServer = urlServer.url;
    } else {
      this.endPointServer = urlServerProd.url;
    }
  }

  login(user: UserSignUpDto): void {
    const endpoint = this.endPointServer + '/user/login';

    this.http.post(endpoint, user, { responseType: 'text' }).subscribe(
      (response) => {
        let roles = [];

        let jwtDecode = jwt_decode(response);

        localStorage.setItem(
          'timeToExpire',
          (
            new Date().getTime() +
            (jwtDecode['expirationTime'] - 300000)
          ).toString()
        );
        roles = jwtDecode['roles'];

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });

        // Redirigir a home, una vez logeado
        localStorage.setItem(this.ISLOGGEDKEY, 'true');
        this.changeLoginStatusSubject.next(true);
        localStorage.setItem('dietUsernameSession', user.username);
        localStorage.setItem('dietJwtSession', response);

        if (roles.includes('ADMIN')) {
          localStorage.setItem(this.ISADMINKEY, 'true');
          this.changeAdminStatusSubject.next(true);
        }

        this.groupService
          .getAthlete(localStorage.getItem('dietUsernameSession'))
          .subscribe((res) => {
            this.atletaRegister = res;
            if (this.atletaRegister == null) {
              this.route.navigate(['athlete']);
              setTimeout(() => {
                Toast.fire({
                  icon: 'info',
                  title: user.username + ', rellena tus datos.',
                });
              }, 10);
            } else {
              this.route.navigate(['home']);
              setTimeout(() => {
                Swal.fire({
                  title: 'Bienvenido a la version Alpha de Diet2gether',
                  icon: 'info',
                  text:
                    'Cualquier error o sugerencia que tenga, no dude en reportarla en la seccion de "Sugerencias de mejoras". Gracias por confiar en nosotros.',
                  showClass: {
                    popup: 'animate__animated animate__fadeInDown',
                  },
                  hideClass: {
                    popup: 'animate__animated animate__fadeOutUp',
                  },
                  confirmButtonText: 'Ok',
                }).then((result) => {
                  this.presentToast(user.username);
                });
              }, 10);
            }
          });
      },
      (error) => {
        this.route.navigate(['login']);
        Swal.fire({
          title: 'Error',
          text: 'Ha habido un error en la autenticacion.',
          icon: 'error',
        });
      }
    );
  }

  logout(): void {
    localStorage.removeItem(this.ISLOGGEDKEY);
    this.changeLoginStatusSubject.next(false);
    localStorage.removeItem(this.ISADMINKEY);
    this.changeAdminStatusSubject.next(false);

    localStorage.removeItem('dietUsernameSession');
    localStorage.removeItem('dietJwtSession');
    localStorage.removeItem('dietFirstSession');
    localStorage.removeItem('timeToExpire');

    this.route.navigate(['welcome']);
  }

  isUserInSession() {
    if (
      new Date() > new Date(Number(localStorage.getItem('timeToExpire'))) &&
      localStorage.getItem('timeToExpire') != null
    ) {
      this.logout();

      Swal.fire({
        title: 'Sesi??n Expirada.',
        text: 'Su sesi??n ha caducado. Inicie sesi??n de nuevo.',
        icon: 'error',
      });
    }
  }

  isLoggedIn(url: string) {
    const isLogged = localStorage.getItem(this.ISLOGGEDKEY);

    if (!isLogged) {
      this.urlUsuarioIntentaAcceder = url;

      return false;
    }

    return true;
  }

  isAdmin(url: string) {
    const isAdmin = localStorage.getItem(this.ISADMINKEY);

    if (!isAdmin) {
      this.adminIntentaAcceder = url;
      return false;
    }

    return true;
  }

  async presentToast(username: string) {
    const toast = await this.toastController.create({
      duration: 5000,
      message: 'Bienvenid@ ' + username,
      position: 'middle',
      color: 'primary',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }
}
