import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
  standalone: false,
})
export class OrderDetailsPage implements OnInit {

  orderId: any;
  orderno: any;
  orderdetails: any = null;
  tax: any;
  orderDate: any;
  total: any;
  orderStatus: any;
  paymentMode: any;
  itemCount: any;
  address: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.orderId = this.route.queryParams.subscribe((data) => {
      console.log(data);
      this.orderno = data['orderId'];
      this.paymentMode = data['paymentMode'];
      this.orderStatus = data['orderStatus'];
      this.address = data['address'];
      this.total = data['total'];
      this.tax = data['tax'];
      this.orderDate = data['created_at'];
      this.orderdetails = JSON.parse(data['orderDetails']);
      console.log(this.orderdetails, 'Order Details');

      const items = Array.isArray(this.orderdetails.items) ? this.orderdetails.items : [];

      this.itemCount = items.reduce((sum: any, item: { amount: any; }) => sum + (item.amount || 0), 0);
    })




    if (this.orderId) {
      //this.loadOrderDetails(this.orderId);
    }
  }

}
