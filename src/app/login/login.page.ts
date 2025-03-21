import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EnvService } from '../services/env.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  showPassword = false;
  errorMessage: string = '';

  constructor(
    private envService: EnvService,
    private router: Router,
    private apiService: ApiService, private alertController: AlertController, private loadingController:LoadingController
  ) { }

  ngOnInit() { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  async login() {
    let user_login = localStorage.getItem('isLoggedIn');
    console.log(user_login);
    // if (user_login === 'true') {
    //   console.log(user_login);
    //   this.router.navigate(['tabs/tab1'])
    // }
    if (!this.email || !this.password) {
      await this.showAlert('Error', 'Please enter both email and password.');
      return;
    }
    if (!this.isValidEmail(this.email)) {
      await this.showAlert('Error', 'Please enter a valid email address.');
      return;
    }
    const loading = await this.loadingController.create({
      message: 'Logging in...', 
      spinner: 'bubbles', // Use 'circles', 'dots', 'bubbles','crescent' etc.
      duration: 5000, // Optional: Set a timeout (e.g., 5 seconds)
    });
    await loading.present();

    const loginData = {
      email: this.email,
      password: this.password,
      storeId: this.apiService.storeId,
    };

    try {
      const response: any = await this.apiService.post('customerlogin', loginData);
      await loading.dismiss();
      console.log('Login Response:', response);

      if (response && response.customer) {
        const customer = response.customer;

        localStorage.setItem('customerId', customer.id.toString());
        localStorage.setItem('customerName', customer.name);
        localStorage.setItem('isLoggedIn', 'true');

        this.envService.user_login = 'true';
        this.router.navigate(['tabs/tab1']);
        console.log('Login successful, customerId:', customer.id);
      } else {
        await this.showAlert('Error', 'Invalid login credentials.');
      }
    } catch (error) {
      console.error('API Error:', error);
      const errorResponse = error as HttpErrorResponse;
      await loading.dismiss();
      const errorMessage = errorResponse?.error?.message || 'Login failed. Please try again.';
      console.error('Login error:', error);
      await this.showAlert('Error', errorMessage);
      if (errorMessage === "You are not registered!") {
        this.router.navigate(['/registration']);
      }
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
