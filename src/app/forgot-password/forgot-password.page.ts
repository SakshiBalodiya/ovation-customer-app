import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false,
})
export class ForgotPasswordPage {
  forgotPasswordForm: FormGroup;
  message: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastController: ToastController,
    private apiService:ApiService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async sendResetLink() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;

    const requestData = {
      email: this.forgotPasswordForm.value.email,
      storeId: this.apiService.storeId,
    };

    try {
      const response: any = await this.apiService.post('passwordforgot', requestData);
      console.log('Password reset email sent:', response);
      this.showToast('A password reset link has been sent to your email.');
    } catch (error) {
      const errorResponse = error as HttpErrorResponse;
      console.error('Error:', errorResponse);
      this.showToast(errorResponse.error?.message || 'Something went wrong!');
    }
  }

  async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }
}
