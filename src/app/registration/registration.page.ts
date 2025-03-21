import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { IonContent } from '@ionic/angular';
import { CustomalertPage } from '../modals/customalert/customalert.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: false,
})
export class RegistrationPage implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  emailError: string = '';
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  constructor(private modalController: ModalController, private fb: FormBuilder, private apiService: ApiService, private router: Router, private alertController: AlertController) {
    this.registerForm = this.fb.group(
      {
        storeId: [apiService.storeId, Validators.required],
        name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/), Validators.maxLength(64)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    this.registerForm.get('email')?.valueChanges.subscribe(email => {
      if (email) {
        this.checkEmail(email);
      } else {
        this.emailError = '';
      }
    });
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  async checkEmail(email: string) {
    try {
      const response: any = await this.apiService.get('emailmatch', { storeId: this.apiService.storeId, email });
      if (response.errorCode === 'true') {
        this.emailError = response.status;
      } else {
        this.emailError = '';
      }
    } catch (error) {
      console.error('Error checking email:', error);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async onSubmit() {
    if (this.registerForm.invalid || this.emailError) {
      let errorMessage = this.emailError || 'Please fill all fields correctly.';
      if (this.registerForm.hasError('mismatch')) {
        errorMessage = 'Passwords do not match.';
      }
      await this.openAlert('Invalid Form', errorMessage);
      return;
    }

    const formData = this.registerForm.value;
    try {
      const response: any = await this.apiService.post('customerregister', formData);
      await this.openAlert('Success', response.message);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('API Error:', error);
      const errorResponse = error as HttpErrorResponse;
      const errorMessage = errorResponse?.error?.message || 'Registration failed. Please try again.';
      await this.openAlert('Error', errorMessage);
      if (errorMessage === 'Email already exists') {
        this.router.navigate(['/']);
      }
    }
  }

  async openAlert(type: string, msg: string) {
    const modal = await this.modalController.create({
      component: CustomalertPage,
      cssClass: 'orderPlaced-modal',
      backdropDismiss: false,
      componentProps: { heading: type, msg: msg },
    });
    await modal.present();
  }
}
