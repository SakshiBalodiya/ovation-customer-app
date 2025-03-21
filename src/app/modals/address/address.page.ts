import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
  standalone: false,
})
export class AddressPage implements OnInit {
  private modal: HTMLIonModalElement | null = null;

  constructor(public modalCtrl: ModalController, private router: Router) {
    // Listen for route changes
    this.router.events.subscribe(() => {
      if (this.modal) {
        this.modal.dismiss(); // Close the modal on route change
        this.modal = null;
      }
    });
  } 

  ngOnInit() {
  }

}
