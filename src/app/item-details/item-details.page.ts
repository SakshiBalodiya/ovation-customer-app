import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
  standalone: false,
})
export class ItemDetailsPage implements OnInit {
  isActive = false;


  constructor() { }

  ngOnInit() {
  }
  toggleFavorite() {
    this.isActive = !this.isActive; // Toggle the favorite state
  }
}
