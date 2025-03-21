import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart = new BehaviorSubject<any[]>([]);
  private cartCount = new BehaviorSubject<number>(0);
  private orderTotal = new BehaviorSubject<number>(0);

  cart$ = this.cart.asObservable();
  cartCount$ = this.cartCount.asObservable();
  orderTotal$ = this.orderTotal.asObservable();

  constructor() {
    this.loadCart();
  }

  loadCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cart.next(cartItems);
    this.updateCart();
  }

  addToCart(item: any) {
    const cartItems = this.cart.value;
    cartItems.push(item);
    this.saveCart(cartItems);
  }

  incrementItem(itemId: number) {
    const cartItems = this.cart.value.map((item) => {
      if (item.id === itemId) item.quantity++;
      return item;
    });
    this.saveCart(cartItems);
  }

  decrementItem(itemId: number) {
    let cartItems = this.cart.value.map((item) => {
      if (item.id === itemId) item.quantity--;
      return item;
    }).filter(item => item.quantity > 0); // Remove items with zero quantity

    this.saveCart(cartItems);
  }

  getCart() {
    return this.cart.value;
  }

  private saveCart(cartItems: any[]) {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    this.cart.next(cartItems);
    this.updateCart();
  }

  private updateCart() {
    const cartItems = this.cart.value;
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const total = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    this.cartCount.next(count);
    this.orderTotal.next(total);
  }
}

