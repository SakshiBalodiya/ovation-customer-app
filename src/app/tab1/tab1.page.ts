import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddressPage } from '../modals/address/address.page';
import { ApiService } from '../services/api.service';
import { NavigationEnd, Router } from '@angular/router';
import {ActionPerformed, PushNotificationSchema, PushNotifications, Token,} from '@capacitor/push-notifications';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  isActive = false;
  name: any;
  email: any;
  categories: any;
  items: any;
  randomItems: any[] = [];
  tokenId: any;
  userId: any = localStorage.getItem('userId');
  cartCount: any;
  orderTotal: any;
  private routerSubscription: Subscription;
  customerId: any;
  addresses: any;
  selectedAddress: any;
  tax: any;
  
  constructor(private modalController: ModalController, private apiService: ApiService, private router: Router, private http: HttpClient) { 
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/tabs/tab1') {
        this.updateCartCount();
        console.log('Cart count updated via router event:', this.cartCount);
      }
    });
  }

  ionViewDidEnter() {
    this.updateCartCount();
    console.log('Cart count updated on view enter:', this.cartCount);
    this.loadAddress();
  }

  async ngOnInit() {
    this.loadCategories();
    this.loadItems();
    await this.apiService.loadCart();
    this.updateCartCount();

    console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        //alert('Push registration success, token: ' + token.value);
        console.log(token.value);
        this.tokenId = token.value;
        this.fcmRegistration(this.tokenId);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }

  async loadAddress() {
    const data = {
      customerId: localStorage.getItem('customerId'),
      storeId: this.apiService.storeId,
    };

    try {
      const response: any = await this.apiService.get('appaddress', data);
      this.addresses = response.addresses;

      // Get selected address ID from localStorage
      const storedAddressId = localStorage.getItem('selectedAddressId') || 1;

      // Find the selected address
      this.selectedAddress = this.addresses.find(
        (address: any) => address.id.toString() === storedAddressId
      ) || 'Select Address';

      console.log('API Response:', this.addresses);
      console.log('Selected Address:', this.selectedAddress);

    } catch (error) {
      console.error('Error fetching address:', error);
    }
  }


  fcmRegistration(tokenId: any) {

    console.log('user id', this.userId);
    console.log('fcm token', this.tokenId)

    let data = ({
      fcm_token: tokenId,
      // userId: this.userId,
      customerId: localStorage.getItem('customerId'),
      storeId: this.apiService.storeId

    });
    this.http.post(this.apiService.apiUrl + '/fcmtoken', data, { headers: { "Content-Type": "application/json" } }).subscribe({
      next: (response: any) => {
        console.log('Response:', response);



      }, error: (err: any) => {
        console.log(err)

      }
    })
  }
  toggleFavorite() {
    this.isActive = !this.isActive;
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

  async loadCategories() {

    const data = {
      storeId: this.apiService.storeId,
    };

    try {
      const response: any = await this.apiService.get('storecategories', data);
      this.categories = response.result;
      console.log('Categories:', this.categories);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  async loadItems() {
    const data = {
      storeId: this.apiService.storeId,
    };

    try {
      const itemsResponse: any = await this.apiService.get('storeitems', data);
      const allItems = itemsResponse.result || [];

      // Select 5 random items from the list
      this.randomItems = this.getRandomItems(allItems, 5);

      console.log('Random 5 Items:', this.randomItems);
    } catch (error) {
      console.error('Error fetching Items:', error);
    }
  }

  // Helper function to pick random 5 items
  getRandomItems(array: any[], count: number): any[] {
    let shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  getItemQuantity(itemId: number): number {
    return this.apiService.getItemQuantity(itemId);
  }

  // addToCart(item: any) {
  //   this.apiService.addToCart(item);
  // }

  // incrementItem(itemId: number) {
  //   this.apiService.incrementItem(itemId);
  // }

  // decrementItem(itemId: number) {
  //   this.apiService.decrementItem(itemId);
  // }
  addToCart(item: any) {
    this.apiService.addToCart(item);
    this.updateCartCount();
  }

  incrementItem(itemId: number) {
    this.apiService.incrementItem(itemId);
    this.updateCartCount();
  }

  decrementItem(itemId: number) {
    this.apiService.decrementItem(itemId);
    this.updateCartCount();
  }

  updateCartCount() {
    const cart = this.apiService.getCart();
    this.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    this.orderTotal = cart.reduce((total, item) => total + parseFloat(item.total), 0);
    this.tax = cart.reduce((tax, item) => tax + parseFloat(item.tax), 0);
  }

  navigateToCategory(category: any) {
    this.router.navigate(['/category'], { state: { selectedCategory: category } });
  }

  itemDetails(itemId: any, item: any) {
    this.router.navigate(['/', 'item-details', itemId], { queryParams: item });
  }
}
