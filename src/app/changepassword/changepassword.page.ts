import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomalertPage } from '../modals/customalert/customalert.page';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
  standalone: false,
})
export class ChangepasswordPage implements OnInit {
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  customerId: string | null = localStorage.getItem('customerId');
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private apiService: ApiService,
    private alertController: AlertController,
    private router: Router,
    private modalController: ModalController
  ) { }

  ngOnInit() { }

  togglePasswordVisibility(field: string) {
    if (field === 'old') {
      this.showOldPassword = !this.showOldPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  async changePassword() {
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.showAlert('Error', 'All fields are required');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.showAlert('Error', 'Password and confirm password do not match');
      return;
    }
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordPattern.test(this.newPassword)) {
      this.showAlert('Error', 'Enter a strong password.');
      return;
    }

    const requestData = {
      storeId: this.apiService.storeId,
      customerId: this.customerId,
      currentPassword: this.oldPassword,
      newPassword: this.newPassword,
      confirmNewPassword: this.confirmPassword,
    };

    try {
      const response: any = await this.apiService.post('changepasswordapp', requestData);

      console.log('API Response:', response);
      if (response.message && response.message === 'Password changed successfully') {
        await this.showAlert('Success', 'Password changed successfully.', true);
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      } else {
        this.showAlert('Error', response.message || 'Password change failed.');
      }
    } catch (error) {
      console.error('API Error:', error);
      const errorResponse = error as HttpErrorResponse;
      const errorMessage = errorResponse?.error?.message || 'Something went wrong. Please try again.';
      this.showAlert('Error', errorMessage);
    }
  }

  // async showAlert(header: string, message: string, navigateToProfile: boolean = false) {
  //   const alert = await this.alertController.create({
  //     header: header,
  //     message: message,
  //     buttons: [
  //       {
  //         text: 'OK',
  //         handler: async () => {
  //           if (navigateToProfile) {
  //             await this.router.navigate(['/tabs/tab4']); 
  //           }
  //         },
  //       },
  //     ],
  //   });
  //   await alert.present();
  // }

  async showAlert(header: string, message: string, navigate: boolean = false) {
    await this.openAlert(header, message);

    if (navigate) {
      this.router.navigate(['/tabs/tab4']);
    }
  }


  async openAlert(type: any, msg: any) {
    const modal = await this.modalController.create({
      component: CustomalertPage,
      cssClass: 'orderPlaced-modal',
      backdropDismiss: true,
      componentProps: {
        heading: type,
        msg: msg,
      }
    });

    await modal.present();

  }
}
