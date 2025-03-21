import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditLocationPageRoutingModule } from './edit-location-routing.module';

import { EditLocationPage } from './edit-location.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditLocationPageRoutingModule,
    TranslateModule
  ],
  declarations: [EditLocationPage]
})
export class EditLocationPageModule {}
