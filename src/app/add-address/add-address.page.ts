import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AlertController, ModalController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
  standalone: false,
})
export class AddAddressPage implements OnInit {
  addressForm: FormGroup;
  selected: string = 'home';
  customerId: any | null = localStorage.getItem('customerId');
  type: any;
  amount: any;
  address: string = '';
  phone: string = '';
  deliveryAddress: any | '';
  latitude: any;
  longitude: any;
  add: any;
  userPhone: any;
  distance: any;
  constructor(private apiService: ApiService, private modalCtrl: ModalController, private alertController: AlertController,
    private fb: FormBuilder, private router: Router, private route: ActivatedRoute) { 
    this.addressForm = this.fb.group({
      address: ['', Validators.required],
      // address2: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], 
      type: ['home'] 
    });
  }

  ngOnInit() {
      // Get address from query parameters
      this.route.queryParams.subscribe(params => {
        if (params['address']) {
          this.deliveryAddress = params['address'];
          this.add = this.deliveryAddress.split(',')[0].trim();
        }
        if (params['lat']) {
          this.latitude = parseFloat(params['lat']);
        }
        if (params['lng']) {
          this.longitude = parseFloat(params['lng']);
        }
      });
    this.loadUserData();
    this.addressForm.patchValue({
      phone: this.userPhone
    });
  }

  setActive(type: string) {
    this.selected = type;
  }

  async loadUserData() {
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

        this.userPhone = userProfile.phone;
        this.addressForm.patchValue({ phone: this.userPhone });
        this.addressForm.get('phone')?.markAsTouched();
        this.addressForm.get('phone')?.updateValueAndValidity();

      } else {
        console.error('No profile data found.');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  async addAddress() {
    if (this.addressForm.invalid) {
      console.log('Form is invalid!');
      return;
    }

    try {
      const data = {
        origins: `26.905322,75.749322`,
        destinations: `${this.latitude},${this.longitude}`,
        api_key: 'Q6pETlo0Z5nhAeXc0RoR49c0apijP4Q6f5X34TPE',
      };

      const response: any = await this.apiService.getExternal('distanceMatrix', data);
      console.log('Ola Matrix API Response:', response);
      this.distance = response.rows[0]?.elements[0]?.distance || 0;
      console.log(this.distance);
    } catch (error) {
      console.error('Error fetching distance from Ola API:', error);
    }

    const requestData = {
      storeId: this.apiService.storeId,
      customerId: this.customerId,
      address: this.addressForm.value.address ?? this.add,
      address2: this.deliveryAddress,
      phone: this.addressForm.value.phone,
      type: this.addressForm.value.type,
      latitude: this.latitude,
      longitude: this.longitude,
      distance: this.distance
    };

    try {
      const response: any = await this.apiService.post('addaddress', requestData);
      console.log('API Response:', response);
      this.router.navigate(['tabs/tab1']);
    } catch (error) {
      console.error('API Error:', error);
    }
  }

  async showAlert(header: string, message: string, navigateToProfile: boolean = false) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: async () => {
          },
        },
      ],
    });

    await alert.present();
  }
}
