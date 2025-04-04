import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private envService: EnvService, private router: Router) {}

  canActivate(): boolean {
    if (this.envService.user_login) {
      return true; 
    } else {
      this.router.navigate(['']); 
      return false;
    }
  }
}
