import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html',
  styleUrls: ['./edit-address.page.scss'],
  standalone: false,
})
export class EditAddressPage implements OnInit {
  selected: string = 'home';
  constructor() { }

  ngOnInit() {
  }
 // Default tab

  setActive(type: string) {
    this.selected = type;
  }
}
