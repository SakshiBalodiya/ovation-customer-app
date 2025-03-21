import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SortByPageRoutingModule } from './sort-by-routing.module';

import { SortByPage } from './sort-by.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SortByPageRoutingModule
  ],
  declarations: [SortByPage]
})
export class SortByPageModule {}
