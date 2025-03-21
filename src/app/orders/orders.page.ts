import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: false,
})
export class OrdersPage implements OnInit {
  selectedSegment: string = 'previous'; // Default tab
  constructor() { }

  ngOnInit() {
  }


  setActiveSegment(event: any) {
    this.selectedSegment = event.value;
  }
}
