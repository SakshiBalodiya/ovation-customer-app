import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Subscription } from 'rxjs';
import { EnvService } from '../services/env.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: false,
})
export class OrdersPage implements OnInit {
  selectedSegment: string = 'previous';
  customerId: string | null = localStorage.getItem('customerId');
  orders: any[] = [];
  networkStatus: string = '';
  networkStatusSubscription: Subscription | null = null;
  cartCount: any;
  orderTotal: any;
  tax: any;
  constructor(private apiService: ApiService, private env: EnvService, private router: Router) {
    this.networkStatusSubscription = this.env.getNetworkStatus().subscribe(status => {
      this.networkStatus = status;
      console.log(this.networkStatus, 'this.networkStatus')
    });
   }

  ngOnInit() {
  }


  ionViewWillEnter() {
    this.loadOrders();
    this.updateCartCount();
  }

  async loadOrders() {
    if (!this.customerId) return;

    const data = {
      customerId: this.customerId,
      storeId: this.apiService.storeId,
    };

    try {
      const response: any = await this.apiService.get('apporders', data);
      console.log('API Response:', response);
      // this.orders = response.orders || [];
      this.orders = response.orders.map((order: { orderDetails: string; }) => {
        const orderDetailsParsed = JSON.parse(order.orderDetails);
        const keys = Object.keys(orderDetailsParsed);
        const items = Array.isArray(orderDetailsParsed.items) ? orderDetailsParsed.items : [];
        return {
          ...order,
          orderDetailsParsed,
          orderDetailsKeys: keys,
          itemCount: items.reduce((sum: any, item: { amount: any; }) => sum + (item.amount || 0), 0)
        };
      });
      // this.orders = response.orders.map((order: { orderDetails: string; }) => ({
      //   ...order,
      //   orderDetailsParsed: JSON.parse(order.orderDetails), // Parse orderDetails string
      // }));
      console.log(this.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }


  setActiveSegment(event: any) {
    this.selectedSegment = event.value;
  }
  reload() {
    window.location.reload();
  }

  openOrder(IdOrder: any, order: any) {
    this.router.navigate(['/', 'order-details', IdOrder], { queryParams: order });
  }

  updateCartCount() {
    const cart = this.apiService.getCart();
    this.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    this.orderTotal = cart.reduce((total, item) => total + parseFloat(item.total), 0);
    this.tax = cart.reduce((tax, item) => tax + parseFloat(item.tax), 0);
  }
}
