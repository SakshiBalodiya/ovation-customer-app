import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Network } from '@capacitor/network';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // apiUrl = "https://majestictechnosoft.com/restojiapinew/public";
  // apiUrl = "http://192.168.1.13/restojiapinew/public";
  apiUrl = "https://api.restoji.com/public/";
  storeId = 1023;
  cart: any[] = [];
  cartData: any;
  customerId: string | null;


  constructor(private http: HttpClient, private alertController: AlertController, private router: Router) {
    this.customerId = localStorage.getItem('customerId');
   }

  async checkNetwork() {
    const status = await Network.getStatus();
    console.log(status);
    if (!status.connected) {
      this.router.navigate(['/no-internet']);
      return false;
    }
    return true;
  }

  async post(endpoint: string, data: any) {
    const isConnected = await this.checkNetwork();
    if (!isConnected) {
      throw new Error('No internet connection');
    }

    let params = new HttpParams();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        params = params.set(key, data[key]);
      }
    }

    return this.http.post(`${this.apiUrl}/${endpoint}`, null, { params }).toPromise();
  }

  async get(endpoint: string, params: any = {}) {
    const isConnected = await this.checkNetwork();
    if (!isConnected) {
      throw new Error('No internet connection');
    }

    return this.http.get(`${this.apiUrl}/${endpoint}`, { params }).toPromise();
  }

  async getExternal(endpoint: string, params: any = {}) {
    const isConnected = await this.checkNetwork();
    if (!isConnected) {
      throw new Error('No internet connection');
    }

    return this.http.get(`https://api.olamaps.io/routing/v1/${endpoint}`, { params }).toPromise();
  }

  getWishlist() {
    return this.http.get<any>(`${this.apiUrl}/appwishlist?storeId=${this.storeId}&customerId=${this.customerId}`).toPromise();
  }

  // Add to wishlist
  addToWishlist(itemId: number) {
    const body = { storeId: this.storeId, customerId: this.customerId, itemId };
    return this.http.post(`${this.apiUrl}/addwishlist`, body).toPromise();
  }

  // Remove from wishlist
  removeFromWishlist(itemId: number) {
    const body = { storeId: this.storeId, customerId: this.customerId, itemId };
    return this.http.post(`${this.apiUrl}/removewishlist`, body).toPromise();
  }

  // async loadCart() {
  //   try {
  //     const response: any = await this.get('appcart', { storeId: this.storeId, customerId: this.customerId });
  //     this.cartData = response;
  //     console.log('cart data', this.cartData);
  //     this.cart = response?.cartDetails ? JSON.parse(response.cartDetails).cart : [];
  //     console.log('cart', this.cart);
  //     localStorage.setItem('cartDetails', JSON.stringify({ cart: this.cart }));
  //   } catch (error) {
  //     console.error('Error loading cart:', error);
  //   }
  // }

  
  async loadCart() {
    try {
      const response: any = await this.get('appcart', { storeId: this.storeId, customerId: this.customerId });
      this.cartData = response;
      console.log('cart data', this.cartData);

      // Check if cartDetails exist and is an array
      if (Array.isArray(this.cartData.cart) && this.cartData.cart.length > 0) {
        const cartDetailsString = this.cartData.cart[0].cartDetails; // Access the first object in the array
        this.cart = cartDetailsString ? JSON.parse(cartDetailsString).cart : [];
      } else {
        this.cart = [];
      }

      console.log('cart', this.cart);
      localStorage.setItem('cartDetails', JSON.stringify({ cart: this.cart }));
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }


  // Function to get current cart
  getCart(): any[] {
    return this.cart;
  }

  // Function to update the cart in API and localStorage
  async updateCart(cart: any[]) {
    this.cart = cart;
    localStorage.setItem('cartDetails', JSON.stringify({ cart }));

    const requestData = {
      storeId: this.storeId,
      customerId: this.customerId,
      cartDetails: JSON.stringify({ cart }),
    };

    try {
      await this.post('addcart', requestData);
    } catch (error) {
      console.error('API Error:', error);
    }
  }

  // Function to check if an item is in the cart
  getItemQuantity(itemId: number): number {
    const item = this.cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  }

  // Function to add an item to the cart
  async addToCart(item: any) {
    let cart = this.getCart();
    let existingItem = cart.find(cartItem => cartItem.id === item.id);

    // if (existingItem) {
    //   existingItem.quantity += 1;
    //   existingItem.tax = (existingItem.quantity * parseFloat(existingItem.tax)).toFixed(2);
    //   existingItem.total = (existingItem.quantity * parseFloat(existingItem.price)).toFixed(2);
    // } else {

      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        taxPercentage: item.taxPercentage,
        tax: parseFloat((item.price * item.taxPercentage / 100).toFixed(2)),
        quantity: 1,
        total: parseFloat(item.price).toFixed(2),
      });
    

    await this.updateCart(cart);
  }

  // Function to increment item quantity
  async incrementItem(itemId: number) {
    let cart = this.getCart();
    let item = cart.find(cartItem => cartItem.id === itemId);

    if (item) {
      item.quantity += 1;
      item.total = (item.quantity * parseFloat(item.price)).toFixed(2);
      item.tax = parseFloat((item.total * item.taxPercentage / 100).toFixed(2))
    }

    await this.updateCart(cart);
  }

  // Function to decrement item quantity
  async decrementItem(itemId: number) {
    let cart = this.getCart();
    let itemIndex = cart.findIndex(cartItem => cartItem.id === itemId);

    if (itemIndex !== -1) {
      let item = cart[itemIndex];
      item.quantity -= 1;

      if (item.quantity <= 0) {
        cart.splice(itemIndex, 1); // Remove item if quantity reaches zero
      } else {
        item.total = (item.quantity * parseFloat(item.price)).toFixed(2);
        item.tax = parseFloat((item.total * item.taxPercentage / 100).toFixed(2))
      }
    }

    await this.updateCart(cart);
  }



}