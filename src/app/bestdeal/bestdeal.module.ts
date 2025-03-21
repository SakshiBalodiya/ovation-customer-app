import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BestdealPageRoutingModule } from './bestdeal-routing.module';

import { BestdealPage } from './bestdeal.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BestdealPageRoutingModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [BestdealPage]
})
export class BestdealPageModule {}
