import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddressPage } from '../modals/address/address.page';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  isActive = false;
  constructor(private modalController: ModalController) {}
    ngOnInit() {
      
    }
  toggleFavorite() {
    this.isActive = !this.isActive;
  }
  async address() {
     const modal = await this.modalController.create({
      component: AddressPage,
      cssClass: 'address-modal',
      breakpoints: [0.25, 0.5, 0.75],
      initialBreakpoint: 0.50,
      // backdropBreakpoint: ,
      componentProps: {
        backdropDismiss: false,
      }
    });
  await modal.present();
}
}
