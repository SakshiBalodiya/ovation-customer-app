import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; 
import { HeaderComponent } from './header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
@NgModule({
  declarations: [HeaderComponent, FooterComponent,],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    RouterModule
  ],
  exports: [HeaderComponent, FooterComponent,],
}) 
export class SharedModule {}
