import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: false,
})
export class RegistrationPage implements OnInit {
  showPassword = false;
  constructor() { }


  ngOnInit() {
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
