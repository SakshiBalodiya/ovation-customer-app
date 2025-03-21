import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddressPage } from '../modals/address/address.page';
import { OrderplacedPage } from '../modals/orderplaced/orderplaced.page';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: false,
})
export class CartPage implements OnInit {

  constructor(private modalController : ModalController) { }

  ngOnInit() {
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
async orderPlaced() {
const modal = await this.modalController.create({
  component: OrderplacedPage,
  cssClass: 'orderPlaced-modal',
  componentProps: {
    backdropDismiss: false,
  }
});
await modal.present();
}
}
