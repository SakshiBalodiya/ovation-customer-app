import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
  standalone: false,
})
export class AddressPage implements OnInit {
  private modal: HTMLIonModalElement | null = null;
  customerId: any;
  addresses: any[] = [];
  selectedAddressId: string = '';
  selectedAddress: any;
  selectedAddress12: any;
  isDeliveryDisabled: boolean = false;
  modalController: any;
  

  constructor(
    public modalCtrl: ModalController,
    private router: Router,
    private apiService: ApiService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) {
    // Listen for route changes
    this.router.events.subscribe(() => {
      if (this.modal) {
        this.modal.dismiss();
        this.modal = null;
      }
    });
  }

  ngOnInit() { }

  ionViewWillEnter() {
    console.log('Profile page entered');
    this.customerId = localStorage.getItem('customerId');

    // Retrieve selected address ID from local storage
    const storedAddressId = localStorage.getItem('selectedAddressId');
    this.selectedAddressId = storedAddressId ? storedAddressId.toString() : '';

    this.loadAddress();
  }

  async loadAddress() {
    if (!this.customerId) return;
    this.selectedAddress = localStorage.getItem('selectedAddressId');

    const data = {
      customerId: this.customerId,
      storeId: this.apiService.storeId,
    };

    try {
      const response: any = await this.apiService.get('appaddress', data);
      this.addresses = response.addresses;
      console.log('API Response:', this.addresses);

      // Auto-select the first address if no selection is stored
      if (!this.selectedAddressId && this.addresses.length > 0) {
        this.selectedAddressId = this.addresses[0].id.toString();
        localStorage.setItem('selectedAddressId', this.selectedAddressId);
      }
      else if(this.addresses.length == 1){
        this.selectedAddressId = this.addresses[0].id.toString();
        localStorage.setItem('selectedAddressId', this.selectedAddressId);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  }

  async onAddressChange(event: any) {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000, // Show for 2 seconds
      spinner: 'bubbles', // Spinner style
    });

    await loading.present(); // Show loading animation

    this.selectedAddressId = event.detail.value;
    localStorage.setItem('selectedAddressId', this.selectedAddressId);
    console.log('Selected Address Saved:', this.selectedAddressId);

    // this.selectedAddress12 = this.addresses.find(
    //   (address: any) => address.id.toString() === this.selectedAddressId
    // ) || 'Select Address';

    // console.log(this.selectedAddress12);

    const data = {
      customerId: localStorage.getItem('customerId'),
      storeId: this.apiService.storeId,
    };

    try {
      const response: any = await this.apiService.get('appaddress', data);
      this.addresses = response.addresses;

      // Get selected address ID from localStorage
      const storedAddressId = localStorage.getItem('selectedAddressId');

      // Find the selected address
      this.selectedAddress = this.addresses.find(
        (address: any) => address.id.toString() === storedAddressId
      ) || 'Select Address';

      console.log('API Response:', this.addresses);
      console.log('Selected Address:', this.selectedAddress);

    } catch (error) {
      console.error('Error fetching address:', error);
    }

    // if (this.selectedAddress) {
    //   const storeLocation = { lat: 26.905322, lng: 75.749322 };
    //   const customerLocation = {
    //     lat: this.selectedAddress.latitude,
    //     lng: this.selectedAddress.longitude,
    //   };

    //   const distance = await this.getDistanceFromOlaAPI(storeLocation, customerLocation);

    //   if (distance > 3000) {
    //     this.showToast('The selected address is more than 3 km away.');
    //     localStorage.setItem('delivery', 'no');
    //   }
    //   else {
    //     localStorage.setItem('delivery', 'yes');
    //   }
    // }

    setTimeout(() => {
      loading.dismiss(); // Hide loading animation
      this.modalCtrl.dismiss(); // Close modal after 2 seconds
    }, 2000);
  }

  checkDeliveryStatus() {
    const deliveryStatus = localStorage.getItem('delivery');
    this.isDeliveryDisabled = deliveryStatus === 'no';
  }

  async getDistanceFromOlaAPI(storeLocation: any, customerLocation: any): Promise<number> {
    try {
      const data = {
        origins: `${storeLocation.lat},${storeLocation.lng}`,
        destinations: `${customerLocation.lat},${customerLocation.lng}`,
        api_key: 'Q6pETlo0Z5nhAeXc0RoR49c0apijP4Q6f5X34TPE',
      };

      const response: any = await this.apiService.getExternal('distanceMatrix', data);
      console.log('Ola Matrix API Response:', response);

      const distance = response.rows[0]?.elements[0]?.distance || 0; 
      console.log(distance);
      this.checkDeliveryStatus();
      return distance;
    } catch (error) {
      console.error('Error fetching distance from Ola API:', error);
      return 0; // Return 0 if there's an error
    }
  }
  async navigateToAddAddress() {
    await  this.modalCtrl.dismiss(); // Close modal first
    this.router.navigate(['/add-location']); // Navigate to Add Address page
  }
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'middle',
    });
    toast.present();
  }

  editAddress(addressId: any, address: any) {
    this.router.navigate(['/', 'edit-location', addressId], { queryParams: address });
  }

  async confirmDeleteAddress(id: any) {
    // Step 1: Show confirmation modal
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this address?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Deletion canceled');
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteAddress(id);
          }
        }
      ]
    });
  
    await alert.present();
  }
  async deleteAddress(id: any) {
    
    const loading = await this.loadingController.create({
      message: 'Deleting address...',
      duration: 2000, // Show for 2 seconds
      spinner: 'bubbles', // Spinner style
    });

    await loading.present(); // Show loading animation
    const requestData = {
      customerId: localStorage.getItem('customerId'),
      storeId: this.apiService.storeId,
      id: id,

    };

    try {
      const response: any = await this.apiService.post('deleteaddress', requestData);
      console.log('API Response:', response);
      if(this.addresses.length == 1)
      {
        localStorage.setItem('selectedAddressId', "null")
      }
      // this.showToast('Address Deleted.');
    } catch (error) {
      console.error('Update Error:', error);
    }
    await loading.dismiss(); // Hide loading animation
    setTimeout(() => {
      loading.dismiss(); // Hide loading animation
      this.modalCtrl.dismiss(); // Close modal after 2 seconds
    }, 1000);
    this.showToast('Address Deleted.');
    
  }
}
