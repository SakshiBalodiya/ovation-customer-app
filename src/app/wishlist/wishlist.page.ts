import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
  standalone: false,
})
export class WishlistPage implements OnInit {
  wishlist: { itemId: number; customerId: number }[] = [];
  allItems: any[] = [];
  wishlistItems: any[] = [];
  customerId: any; // Ensure customerId is a number
  cartCount: any;
  orderTotal: any;
  tax: any;

  constructor(private apiService: ApiService, private router: Router) {
   // Convert to number
  }

  ngOnInit() {
    this.customerId = Number(localStorage.getItem('customerId')); 
   }

  ionViewWillEnter() {
    this.loadWishlist();
    this.updateCartCount();
  }

  async loadWishlist() {
    try {
      const wishlistResponse: any = await this.apiService.getWishlist();
      console.log('Wishlist Response:', wishlistResponse);

      // Ensure customerId comparison works correctly
      this.wishlist = wishlistResponse.wishlists.filter(
        (item: { itemId: number; customerId: number }) => item.customerId === this.customerId
      );

      console.log('Filtered Wishlist:', this.wishlist);

      const itemsResponse: any = await this.apiService.get('storeitems', { storeId: this.apiService.storeId });
      this.allItems = itemsResponse.result;

      this.wishlistItems = this.allItems.filter(item =>
        this.wishlist.some(wish => wish.itemId === item.id)
      );

      console.log('Wishlist Items:', this.wishlistItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }

  async removeFromWishlist(itemId: number) {
    try {
      await this.apiService.removeFromWishlist(itemId);

      this.wishlist = this.wishlist.filter(wish => wish.itemId !== itemId);
      this.wishlistItems = this.wishlistItems.filter(item => item.id !== itemId);
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
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
