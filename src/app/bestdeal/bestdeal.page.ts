import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bestdeal',
  templateUrl: './bestdeal.page.html',
  styleUrls: ['./bestdeal.page.scss'],
  standalone: false,
})
export class BestdealPage implements OnInit {
  randomItems: any;
  categories: any[] = [];
  items: any[] = [];
  selectedCategory: any = null;
  filteredItems: any;
  wishlist: number[] = [];
  customerId: number;
  amount: any;
  type: any;
  cartCount: any;
  orderTotal: any;
  tax: any;

  constructor(private apiService: ApiService, private router: Router) { 
    this.customerId = Number(localStorage.getItem('customerId')); 
  }

  async ngOnInit() {
    this.loadItems();
    this.loadWishlist();
    await this.apiService.loadCart();
    this.updateCartCount();
  }

  async loadWishlist() {
    try {
      const response: any = await this.apiService.getWishlist();
      console.log('Wishlist Response:', response);

      const customerWishlist = response.wishlists.filter(
        (item: { customerId: number }) => item.customerId === this.customerId
      );

      this.wishlist = customerWishlist.map((item: { itemId: any }) => item.itemId);

      console.log('Filtered Wishlist:', this.wishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }

  isInWishlist(itemId: number): boolean {
    return this.wishlist.includes(itemId);
  }

  async toggleWishlist(itemId: number) {
    try {
      if (this.isInWishlist(itemId)) {
        await this.apiService.removeFromWishlist(itemId);
        this.wishlist = this.wishlist.filter(id => id !== itemId);
      } else {
        await this.apiService.addToWishlist(itemId);
        this.wishlist.push(itemId);
      }
    } catch (error) {
      console.error('Wishlist Error:', error);
    }
  }

  async loadItems() {
    const data = {
      storeId: this.apiService.storeId,
    };

    try {
      const itemsResponse: any = await this.apiService.get('storeitems', data);
      const allItems = itemsResponse.result || [];

      this.randomItems = this.getRandomItems(allItems, 10);

      console.log('Random 10 Items:', this.randomItems);
    } catch (error) {
      console.error('Error fetching Items:', error);
    }
  }

  getRandomItems(array: any[], count: number): any[] {
    let shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  getItemQuantity(itemId: number): number {
    return this.apiService.getItemQuantity(itemId);
  }

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

  itemDetails(itemId: any, item: any) {
    this.router.navigate(['/', 'item-details', itemId], { queryParams: item });
  }
}
