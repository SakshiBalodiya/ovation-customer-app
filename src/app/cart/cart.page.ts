import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AddressPage } from '../modals/address/address.page';
import { OrderplacedPage } from '../modals/orderplaced/orderplaced.page';
import { ApiService } from '../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: false,
})
export class CartPage implements OnInit {
  type: any;
  customerId: string | null = localStorage.getItem('customerId');
  amount: any;
  items: any[] = [];
  cart: any[] = [];
  cartItems: any[] = [];
  addresses: any;
  selectedAddress: any;
  addressId: any;
  isDeliveryDisabled: boolean = false;
  isLoading = true;
  selectedAddressId: any;
  constructor(private modalController: ModalController, private apiService: ApiService, private alertController: AlertController, private loadingController: LoadingController, private toastController: ToastController) {

  }

  // async ngOnInit() {
  //   this.amount = 183;
  //   this.loadData();
  //   await this.apiService.loadCart();
  // }
  async ngOnInit() {

    // this.amount = this.getOrderTotal();
    // console.log(this.amount);
    await this.apiService.loadCart();
    this.cart = this.apiService.getCart();
    // await this.loadData();
    this.matchCartWithItems();
    this.loadAddress();
    
  }
  async ionViewDidEnter() {
    await this.apiService.loadCart();
    this.cart = this.apiService.getCart();
    
    await this.loadData();
    this.matchCartWithItems();
    this.loadAddress();
    this.checkDeliveryStatus();
  }
  async loadData() {
    let loading;
    if (this.cart.length > 0) {
      this.isLoading = true;
      console.log("loading")
       loading = await this.loadingController.create({
        message: 'Loading...',
        spinner: 'bubbles', // Use 'circles', 'dots', 'bubbles','crescent' etc.
        duration: 5000, // Optional: Set a timeout (e.g., 5 seconds)
      });
      await loading.present();
    }
    const data = {
      storeId: this.apiService.storeId,
    };
    
    try {
      const itemsResponse: any = await this.apiService.get('storeitems', data);
      // await loading.dismiss();

      // Ensure response has a 'result' key
      this.items = itemsResponse.result ?? [];

      console.log("Store Items:", this.items);
    } catch (error) {
      // await loading.dismiss();
      console.error('Error fetching Items:', error);
      this.items = [];  // Set to an empty array in case of an error
    }
    finally {
      if (this.isLoading == true && loading) {
       
        await loading.dismiss();
      }
     
      this.isLoading = false; // Set loading to false after fetching data
    }
  }

  async loadAddress() {
    this.selectedAddressId = localStorage.getItem('selectedAddressId');
    console.log(this.selectedAddressId , 'this.selectedAddressId ')
    
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
      ) || null;

      console.log('API Response:', this.addresses);
      console.log('Selected Address:', this.selectedAddress);

    } catch (error) {
      console.error('Error fetching address:', error);
    }
  }

  checkDeliveryStatus() {

    const selectedAddressId = localStorage.getItem('selectedAddressId');

    if (selectedAddressId) {
      this.isDeliveryDisabled = false;
    }
    // const deliveryStatus = localStorage.getItem('delivery');
    // this.isDeliveryDisabled = deliveryStatus === 'no';
  }

  matchCartWithItems() {
    console.log("Matching cart with items...");
    console.log("Cart Data:", this.cart);
    console.log("Items Data:", this.items);

    // Ensure items is an array
    if (!Array.isArray(this.items)) {
      console.error("Items is not an array!", this.items);
      return;
    }

    if (Array.isArray(this.cart) && Array.isArray(this.items)) {
      this.cartItems = this.items.filter(item =>
        this.cart.some(cartItem => cartItem.id == item.id)
      );
      console.log("Matched Cart Items:", this.cartItems);
    } else {
      console.log("No matching items found or data not loaded.");
    }
  }


  getItemQuantity(itemId: number): number {
    return this.apiService.getItemQuantity(itemId);
  }

  getOrderTotal(): number {
    return this.cart.reduce((total, item) => total + parseFloat(item.total), 0);
  }

  getTaxTotal(): number {
    return this.cart.reduce((tax, item) => tax + parseFloat(item.tax), 0);
  }

  incrementItem(itemId: number) {
    this.apiService.incrementItem(itemId);
    this.matchCartWithItems();
  }

  decrementItem(itemId: number) {
    this.apiService.decrementItem(itemId);
    this.matchCartWithItems();
  }

  async address() {
    const modal = await this.modalController.create({
      component: AddressPage,
      cssClass: 'address-modal',
      breakpoints: [0.25, 0.5, 0.75],
      initialBreakpoint: 0.50,
      // backdropBreakpoint: ,
      componentProps: {
        backdropDismiss: false,
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    this.loadAddress(); 
  }

  async orderPlaced() {
    const modal = await this.modalController.create({
      component: OrderplacedPage,
      cssClass: 'orderPlaced-modal',
      componentProps: {
        backdropDismiss: false,
      }
    });
    await modal.present();
  }

  // async placeOrder() {
  //   const requestData = {
  //     storeId: this.apiService.storeId,
  //     customerId: this.customerId,
  //     orderDetails: JSON.stringify({ 'Items': [{ "price": this.amount }] }),
  //     tax: 0.00,
  //     discount: 0.00,
  //     total: this.amount,
  //     paymentMode: 'cod',
  //     orderStatus: 'placed',
  //   };

  //   try {
  //     const response: any = await this.apiService.post('placeorderapp', requestData);

  //     console.log('API Response:', response);
  //     if (response.message && response.message === "Order placed successfully") {
  //       const modal = await this.modalController.create({
  //         component: OrderplacedPage,
  //         cssClass: 'orderPlaced-modal',
  //         componentProps: {
  //           backdropDismiss: false,
  //         }
  //       });
  //       await modal.present();
  //     } else {
  //       this.showAlert('Error', response.message || 'Order failed.');
  //     }
  //   } catch (error) {
  //     console.error('API Error:', error);
  //     const errorResponse = error as HttpErrorResponse;
  //     const errorMessage = errorResponse?.error?.message || 'Something went wrong. Please try again.';
  //     this.showAlert('Error', errorMessage);
  //   }
  // }

  async placeOrder() {
    const orderDetails = {
      items: this.cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        tax: parseFloat(((item.price * item.taxPercentage / 100)*item.quantity).toFixed(2)),
        amount: item.quantity,
        total: item.total
      }))
    };

    const orderTotal = this.cart.reduce((total, item) => total + parseFloat(item.total), 0);
    const tax = this.cart.reduce((tax, item) => tax + parseFloat(item.tax), 0);
    const loading = await this.loadingController.create({
      message: 'Placing Order...',
      spinner: 'bubbles', // Use 'circles', 'dots', 'bubbles','crescent' etc.
      duration: 5000, // Optional: Set a timeout (e.g., 5 seconds)
    });
    await loading.present();

    if (!this.selectedAddress || !this.selectedAddress.address) {
      this.showToast(`Please Select Address`);
      await loading.dismiss(); 
      return;
    }

    const requestData = {
      storeId: this.apiService.storeId,
      customerId: this.customerId,
      address: `${this.selectedAddress.address}, ${this.selectedAddress.address2}`.trim(),
      contactNumber: this.selectedAddress.contactNumber,
      orderDetails: JSON.stringify(orderDetails), 
      tax: tax.toFixed(2),
      discount: 0.00,
      total: orderTotal.toFixed(2), 
      paymentMode: 'cod',
      orderStatus: 'placed',
    };

    try {
      const response: any = await this.apiService.post('placeorderapp', requestData);
      await loading.dismiss();

      console.log('API Response:', response);
      if (response.message && response.message === "Order placed successfully") {
        await this.apiService.updateCart([]);
        this.cart = [];
        this.cartItems = [];
        const modal = await this.modalController.create({
          component: OrderplacedPage,
          cssClass: 'orderPlaced-modal',
          componentProps: {
            backdropDismiss: false,
          }
        });
        await modal.present();
      } else {
        this.showAlert('Error', response.message || 'Order failed.');
      }
    } catch (error) {
      console.error('API Error:', error);
      const errorResponse = error as HttpErrorResponse;
      const errorMessage = errorResponse?.error?.message || 'Something went wrong. Please try again.';
      this.showAlert('Error', errorMessage);
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

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
}
