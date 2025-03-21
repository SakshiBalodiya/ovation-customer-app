import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartPageRoutingModule } from './cart-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CartPage } from './cart.page';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartPageRoutingModule,
    TranslateModule
  ],
  declarations: [CartPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CartPageModule {}
