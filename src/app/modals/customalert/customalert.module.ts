import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomalertPageRoutingModule } from './customalert-routing.module';

import { CustomalertPage } from './customalert.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomalertPageRoutingModule
  ],
  declarations: [CustomalertPage]
})
export class CustomalertPageModule {}
