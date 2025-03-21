import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    TranslateModule
  ],
  declarations: [SearchPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SearchPageModule {}
