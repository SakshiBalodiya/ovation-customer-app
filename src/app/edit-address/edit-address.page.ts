import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html',
  styleUrls: ['./edit-address.page.scss'],
  standalone: false,
})
export class EditAddressPage implements OnInit {
  selected: string = '';
  addressId: any;
  address: any;
  contactNumber: any;
  name: any;
  type: any;
  deliveryAddress: any;
  add: any;
  latitude: any;
  longitude: any;
  addressForm: FormGroup;
  customerId: any | null = localStorage.getItem('customerId');
  id: any;
  distance: any;
  constructor(private route: ActivatedRoute, private fb: FormBuilder,private apiService: ApiService, private router: Router) { 
    this.addressForm = this.fb.group({
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      type: [this.selected] 
        });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.address = params['address'] || this.address;
      this.deliveryAddress = params['address2'] || this.deliveryAddress;
      this.latitude = params['lat'] ? parseFloat(params['lat']) : this.latitude;
      this.longitude = params['lng'] ? parseFloat(params['lng']) : this.longitude;
      this.contactNumber = params['contactNumber'] ? params['contactNumber'] : this.contactNumber;
      this.id = params['id'] ? params['id'] : this.id;
      this.type = params['type'] || 'home';  // Default to 'home' if no type is provided
      this.setActive(this.type);
    });
  }


  setActive(type: string) {
    this.selected = type;
    this.addressForm.patchValue({ type: type });
  }

  async updateAddress() {
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
      id: this.id,
      address: this.addressForm.value.address ?? this.add,
      address2: this.deliveryAddress,
      phone: this.addressForm.value.phone,
      type: this.addressForm.value.type,  // Ensure `type` is taken from form
      latitude: this.latitude,  // Make sure these values are set correctly
      longitude: this.longitude,
      distance: this.distance
    };

    console.log('Request Data:', requestData); // Debug before sending

    try {
      const response: any = await this.apiService.post('updateaddress', requestData);
      console.log('API Response:', response);
      this.router.navigate(['tabs/tab1']);
    } catch (error) {
      console.error('API Error:', error);
    }
  }


}
