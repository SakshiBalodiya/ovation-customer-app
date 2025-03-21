import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
  standalone: false,
})
export class AddAddressPage implements OnInit {
  selected: string = 'home';
  constructor() { }

  ngOnInit() {
  }
 // Default tab

  setActive(type: string) {
    this.selected = type;
  }
}
