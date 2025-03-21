import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnvService } from '../services/env.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  constructor(private envService: EnvService, private router: Router) {}
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  ngOnInit() {
  }
  login() {
    this.envService.user_login = true; // Set login to true
    this.router.navigate(['tabs/tab1']); // Navigate to home page
    console.log(this.envService.user_login, 'this.envService.user_login')
  }
}
