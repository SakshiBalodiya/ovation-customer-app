import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomalertPage } from '../modals/customalert/customalert.page';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  styleUrls: ['./editprofile.page.scss'],
  standalone: false,
})
export class EditprofilePage implements OnInit {
  name: string = '';
  email: string = '';
  contact: string = '';
  customerId: string | null = localStorage.getItem('customerId');
  nameError: any;
  emailError: any;
  contactError: any;

  constructor(private apiService: ApiService, private alertController: AlertController, private router: Router, private modalController: ModalController) { }

  ngOnInit() {
    if (!this.customerId) {
      console.error('Customer ID not found in localStorage');
      return;
    }
    this.loadUserProfile();
  }

  validateName() {
    this.nameError = this.name.trim() ? '' : 'Name is required.';
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailError = emailPattern.test(this.email) ? '' : 'Enter a valid email address.';
  }

  validateContact() {
    const contactPattern = /^[0-9]{10}$/;
    this.contactError = contactPattern.test(this.contact) ? '' : 'Enter a valid 10 digit contact number.';
  }

  async loadUserProfile() {
    if (!this.customerId) return;

    const data = {
      customerId: this.customerId,
      storeId: this.apiService.storeId,
    };

    try {
      const response: any = await this.apiService.get('profile', data);
      console.log('API Response:', response);

      if (response.profile && response.profile.length > 0) {
        const userProfile = response.profile[0];

        this.name = userProfile.name;
        this.email = userProfile.email;
        this.contact = userProfile.phone;

        console.log('Profile Loaded:', this.name, this.email, this.contact);
      } else {
        console.error('No profile data found.');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }
  isFormInvalid(): boolean {
    return this.nameError || this.emailError || this.contactError || !this.name || !this.email || !this.contact;
  }

  async updateProfile() {
    if (!this.name.trim()) {
      this.showAlert('Error', 'Name is required.');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.showAlert('Error', 'Please enter a valid email address.');
      return;
    }

    if (!this.isValidContact(this.contact)) {
      this.showAlert('Error', 'Please enter a valid 10-digit contact number.');
      return;
    }

    const requestData = {
      customerId: this.customerId,
      storeId: this.apiService.storeId,
      name: this.name,
      email: this.email,
      phone: this.contact,
    };

    try {
      const response: any = await this.apiService.post('editprofile', requestData);
      console.log('API Response:', response);

      if (response && response.message && response.message.toLowerCase().includes('success')) {
        this.showAlert('Success', response.message, true);
      } else {
        this.showAlert('Error', response.message || 'Profile update failed.');
      }
    } catch (error) {
      const errorResponse = error as HttpErrorResponse;
      const errorMessage = errorResponse?.error?.message || 'Something went wrong. Please try again.';
      console.error('Update Error:', error);
      this.showAlert('Error', errorMessage);
      this.loadUserProfile();
    }
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  isValidContact(contact: string): boolean {
    const contactPattern = /^[0-9]{10}$/;
    return contactPattern.test(contact);
  }

  // async showAlert(header: string, message: string, navigate: boolean = false) {
  //   const alert = await this.alertController.create({
  //     header: header,
  //     message: message,
  //     buttons: [{
  //       text: 'OK',
  //       handler: () => {
  //         if (navigate) {
  //           this.router.navigate(['/tabs/tab4']);
  //         }
  //       }
  //     }],
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
      backdropDismiss: false,
      componentProps: {
        heading: type,
        msg: msg,
      }
    });

    await modal.present();

  }
}
