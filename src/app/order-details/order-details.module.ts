import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderDetailsPageRoutingModule } from './order-details-routing.module';

import { OrderDetailsPage } from './order-details.page';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderDetailsPageRoutingModule,
    TranslateModule
  ],
  declarations: [OrderDetailsPage]
})
export class OrderDetailsPageModule {}
