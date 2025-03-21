import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { AddAddressPageRoutingModule } from './add-address-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddAddressPage } from './add-address.page';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddAddressPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  declarations: [AddAddressPage]
})
export class AddAddressPageModule {}
