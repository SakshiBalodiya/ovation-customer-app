import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class loginguardGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let user_login = localStorage.getItem('isLoggedIn');
    console.log(user_login);
    if (user_login === 'true') {
      console.log(user_login);
      this.router.navigate(['tabs/tab1'])
      return false;
    } else {
      return true
    }
  };

}
