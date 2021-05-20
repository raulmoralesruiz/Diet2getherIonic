import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LogInService } from './log-in.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuard implements CanActivate {

  constructor(private route:Router, private loginService:LogInService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if (this.loginService.isLoggedIn(state.url)) {
        return true;
      }

      this.route.navigate(['/login']);
    return true;
  }
  
}
